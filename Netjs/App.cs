// Copyright 2014-2016 Frank A. Krueger
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//    http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using ICSharpCode.Decompiler;
using ICSharpCode.Decompiler.Ast;
using Mono.Cecil;

namespace Netjs
{
	public class App : IAssemblyResolver
	{
		class Config
		{
			public List<string> AssembliesToDecompile = new List<string> ();
			public bool ShowHelp = false;
			public bool ES3Compatible = false;
			public bool IncludeRefs = false;
		}

		public static int Main (string[] args)
		{
			var config = new Config ();
			for (int i = 0; i < args.Length; i++) {
				var a = args[i];
				switch (a) {
					case "--includerefs":
					case "-r":
						config.IncludeRefs = true;
						break;
					case "--help":
					case "-h":
					case "-?":
					case "/?":
						config.ShowHelp = true;
						break;
				case "--es3":
				case "-es3":
					config.ES3Compatible = true;
					break;
					default:
						if (!a.StartsWith ("-")) {
							config.AssembliesToDecompile.Add (a);
						}
						break;
				}
			}
			try {
				new App ().Run (config);
				return 0;
			} catch (Exception ex) {
				Error ("{0}", ex);
				return 1;
			}
		}

		void Run (Config config)
		{
			if (config.AssembliesToDecompile.Count == 0) {
				config.ShowHelp = true;
			}

			if (config.ShowHelp) {
				Console.WriteLine ("Netjs compiler, Copyright 2014-2016 Frank A. Krueger");
				Console.WriteLine ("netjs [options] assembly-files");
				Console.WriteLine ("   --help, -h           Show usage information");
				Console.WriteLine ("   --includerefs, -r    Decompile referenced assemblies");
				return;
			}

			string outPath = "";
			var asmPaths = new List<string> ();

			foreach (var asmRelPath in config.AssembliesToDecompile) {
				var asmPath = Path.GetFullPath (asmRelPath);
				asmPaths.Add (asmPath);

				if (string.IsNullOrEmpty (outPath)) {
					outPath = Path.ChangeExtension (asmPath, ".ts");
				}

				var asmDir = Path.GetDirectoryName (asmPath);
				if (!asmSearchPaths.Exists (x => x.Item1 == asmDir)) {
					asmSearchPaths.Add (Tuple.Create (asmDir, config.IncludeRefs));
				}
			}

			Step ("Reading IL");
			globalReaderParameters.AssemblyResolver = this;
			globalReaderParameters.ReadingMode = ReadingMode.Immediate;

			var libDir = Path.GetDirectoryName (typeof (String).Assembly.Location);
			asmSearchPaths.Add (Tuple.Create(libDir, false));
			asmSearchPaths.Add (Tuple.Create(Path.Combine (libDir, "Facades"), false));

			AssemblyDefinition firstAsm = null;
			foreach (var asmPath in asmPaths) {
				var asm = AssemblyDefinition.ReadAssembly (asmPath, globalReaderParameters);
				if (firstAsm == null)
					firstAsm = asm;
				referencedAssemblies[asm.Name.Name] = asm;
				decompileAssemblies.Add (asm);
			}

			Step ("Decompiling IL to C#");
			var context = new DecompilerContext (firstAsm.MainModule);
			context.Settings.ForEachStatement = false;
			context.Settings.ObjectOrCollectionInitializers = false;
			context.Settings.UsingStatement = false;
			context.Settings.AsyncAwait = false;
			context.Settings.AutomaticProperties = true;
			context.Settings.AutomaticEvents = true;
			context.Settings.QueryExpressions = false;
			context.Settings.AlwaysGenerateExceptionVariableForCatchBlocks = true;
			context.Settings.UsingDeclarations = false;
			context.Settings.FullyQualifyAmbiguousTypeNames = true;
			context.Settings.YieldReturn = false;
			var builder = new AstBuilder (context);
			var decompiled = new HashSet<string> ();
			for (;;) {
				var a = decompileAssemblies.FirstOrDefault (x => !decompiled.Contains (x.FullName));
				if (a != null) {
					Info ("  Decompiling {0}", a.FullName);
					builder.AddAssembly (a);
					decompiled.Add (a.FullName);
				}
				else {
					break;
				}
			}
			builder.RunTransformations ();

			Step ("Translating C# to TypeScript");
			new CsToTs (config.ES3Compatible).Run (builder.SyntaxTree);

			Step ("Writing");
			using (var outputWriter = new StreamWriter (outPath)) {
				var output = new PlainTextOutput (outputWriter);
				builder.GenerateCode (output, (s, e) => new TsOutputVisitor (s, e));
			}

			Step ("Done");
		}

		#region Logging

		public static void Step (string message)
		{
			Console.ForegroundColor = ConsoleColor.Cyan;
			Console.WriteLine (message);
			Console.ResetColor ();
		}

		public static void Warning (string format, params object[] args)
		{
			Warning (string.Format (format, args));
		}

		public static void Warning (string message)
		{
			Console.ForegroundColor = ConsoleColor.Yellow;
			Console.WriteLine (message);
			Console.ResetColor ();
		}

		public static void Error (string format, params object[] args)
		{
			Console.ForegroundColor = ConsoleColor.Red;
			Console.WriteLine (format, args);
			Console.ResetColor ();
		}

		public static void Info (string format, params object[] args)
		{
			Console.WriteLine (format, args);
		}

		#endregion

		#region IAssemblyResolver implementation

		readonly ReaderParameters globalReaderParameters = new ReaderParameters ();
		readonly List<Tuple<string, bool>> asmSearchPaths = new List<Tuple<string, bool>> ();
		readonly Dictionary<string, AssemblyDefinition> referencedAssemblies = new Dictionary<string, AssemblyDefinition> ();
		readonly List<AssemblyDefinition> decompileAssemblies = new List<AssemblyDefinition> ();

		public AssemblyDefinition Resolve (AssemblyNameReference name)
		{
			//Info ("R1: {0}", name);
			return Resolve (name, globalReaderParameters);
		}
		public AssemblyDefinition Resolve (AssemblyNameReference name, ReaderParameters parameters)
		{
			//Info ("R2: {0}", name);
			var n = name.Name;
			AssemblyDefinition asm;
			if (!referencedAssemblies.TryGetValue (n, out asm)) {
				foreach (var x in asmSearchPaths) {
					var asmDir = x.Item1;
					var fn = Path.Combine (asmDir, name.Name + ".dll");
					if (File.Exists (fn)) {
						asm = AssemblyDefinition.ReadAssembly (fn, parameters);
						referencedAssemblies[n] = asm;
						if (x.Item2) {
							decompileAssemblies.Add (asm);
						}
						Info ("    Loaded {0} (decompile={1})", fn, x.Item2);
						break;
					}
				}
				if (asm == null) {
					Error ("    Could not find assembly {0}", name);
				}
			}
			return asm;
		}
		public AssemblyDefinition Resolve (string fullName)
		{
			//Info ("R3: {0}", fullName);
			return null;
		}
		public AssemblyDefinition Resolve (string fullName, ReaderParameters parameters)
		{
			//Info ("R4: {0}", fullName);
			return null;
		}

		#endregion
	}
}
