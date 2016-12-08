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
			public string MainAssembly = "";
			public bool ShowHelp = false;
		}

		public static int Main (string[] args)
		{
			var config = new Config ();
			for (int i = 0; i < args.Length; i++) {
				var a = args [i];
				switch (a) {
				case "--help":
				case "-help":
				case "-?":
					config.ShowHelp = true;
					break;
				default:
					config.MainAssembly = a;
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
			if (config.ShowHelp) {
				Console.WriteLine ("Netjs compiler, Copyright 2014-2016 Frank A. Krueger");
				Console.WriteLine ("netjs [options] assembly-file");
				Console.WriteLine ("   -help                Lists all compiler options (short: -?)");
				return;
			}

			if (string.IsNullOrEmpty (config.MainAssembly)) {
				throw new Exception ("No assembly specified.");
			}

			var asmPath = Path.GetFullPath (config.MainAssembly);
			asmSearchPaths.Add (Path.GetDirectoryName (asmPath));

			var outPath = Path.ChangeExtension (asmPath, ".ts");

			Step ("Reading IL");
			globalReaderParameters.AssemblyResolver = this;
			globalReaderParameters.ReadingMode = ReadingMode.Immediate;

			var libDir = Path.GetDirectoryName (typeof (String).Assembly.Location);
			asmSearchPaths.Add (libDir);
			asmSearchPaths.Add (Path.Combine (libDir, "Facades"));
			var asm = AssemblyDefinition.ReadAssembly (asmPath, globalReaderParameters);

			Step ("Decompiling IL to C#");
			var context = new DecompilerContext (asm.MainModule);
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
			var added = new HashSet<string> ();
			builder.AddAssembly (asm);
			added.Add (asm.FullName);
			for (;;) {
				var a = referencedAssemblies.Values.FirstOrDefault (x => !added.Contains (x.FullName));
				if (a != null) {
					builder.AddAssembly (a);
					added.Add (a.FullName);
				}
				else {
					break;
				}
			}
			builder.RunTransformations ();

			Step ("Translating C# to TypeScript");
			new CsToTs ().Run (builder.SyntaxTree);

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
		readonly List<string> asmSearchPaths = new List<string> ();
		readonly Dictionary<string, AssemblyDefinition> referencedAssemblies = new Dictionary<string, AssemblyDefinition> ();

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
				foreach (var asmDir in asmSearchPaths) {
					var fn = Path.Combine (asmDir, name.Name + ".dll");
					if (File.Exists (fn)) {
						asm = AssemblyDefinition.ReadAssembly (fn, parameters);
						referencedAssemblies[n] = asm;
						Info ("  Loaded {0}", fn);
						break;
					}
				}
				if (asm == null) {
					Error ("  Could not find assembly {0}", name);
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
