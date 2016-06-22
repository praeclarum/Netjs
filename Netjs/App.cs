// Copyright 2014 Frank A. Krueger
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
		string asmDir = "";

		class Config
		{
			public string MainAssembly = "";
			public bool ShowHelp = false;
			public bool ES3Compatible = false;
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
				case "--es3":
				case "-es3":
					config.ES3Compatible = true;
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
				Console.WriteLine ("Netjs compiler, Copyright 2014 Frank A. Krueger");
				Console.WriteLine ("netjs [options] assembly-file");
				Console.WriteLine ("   -help                Lists all compiler options (short: -?)");
				return;
			}

			if (string.IsNullOrEmpty (config.MainAssembly)) {
				throw new Exception ("No assembly specified.");
			}

			var asmPath = Path.GetFullPath (config.MainAssembly);
			asmDir = Path.GetDirectoryName (asmPath);
			var outPath = Path.ChangeExtension (asmPath, ".ts");

			Step ("Reading IL");
			var parameters = new ReaderParameters {
				AssemblyResolver = this,
			};
			var asm = AssemblyDefinition.ReadAssembly (asmPath, parameters);
			mscorlib = AssemblyDefinition.ReadAssembly (typeof(String).Assembly.Location, parameters);
			system = AssemblyDefinition.ReadAssembly (typeof(INotifyPropertyChanged).Assembly.Location, parameters);
			systemCore = AssemblyDefinition.ReadAssembly (typeof(Enumerable).Assembly.Location, parameters);
			systemDrawing = AssemblyDefinition.ReadAssembly (typeof(System.Drawing.Bitmap).Assembly.Location, parameters);

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
			builder.AddAssembly (asm);
			foreach (var a in referencedAssemblies.Values) {
				if (a != null)
					builder.AddAssembly (a);
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
			
		#region IAssemblyResolver implementation

		AssemblyDefinition mscorlib;
		AssemblyDefinition system;
		AssemblyDefinition systemCore;
		AssemblyDefinition systemDrawing;

		readonly Dictionary<string, AssemblyDefinition> referencedAssemblies = new Dictionary<string, AssemblyDefinition> ();

		public AssemblyDefinition Resolve (AssemblyNameReference name)
		{
			return Resolve (name, null);
		}
		public AssemblyDefinition Resolve (AssemblyNameReference name, ReaderParameters parameters)
		{
			switch (name.Name) {
			case "mscorlib":
				return mscorlib;
			case "System":
				return system;
			case "System.Core":
				return systemCore;
			case "System.Drawing":
				return systemDrawing;
			default:
				var n = name.Name;
				AssemblyDefinition asm;
				if (!referencedAssemblies.TryGetValue (n, out asm)) {
					var fn = Path.Combine (asmDir, name.Name + ".dll");
					if (File.Exists (fn)) {

						asm = parameters != null ? 
							AssemblyDefinition.ReadAssembly (fn, parameters) : 
							AssemblyDefinition.ReadAssembly (fn);
						Info ("  Loaded {0}", fn);
					}
					else {
						asm = null;
						Error ("  Could not find assembly {0}", name);
					}
					referencedAssemblies [n] = asm;
				}
				return asm;
			}
		}
		public AssemblyDefinition Resolve (string fullName)
		{
			return null;
		}
		public AssemblyDefinition Resolve (string fullName, ReaderParameters parameters)
		{
			return null;
		}
		#endregion
	}
}
