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
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Text;

namespace Minify
{
	public class App
	{
		static readonly HashSet<string> Keeps = new HashSet<string> {
			"arguments", "prototype", "constructor",
			"addEventListener", "toString", 
			"true", "false", "null", "NaN", "Infinity", "E", "PI",

			"Object", "Boolean",
			"Number", "isNaN", "parseFloat", "parseInt",
			"Array", "length", "push", "slice", "splice", "indexOf", "join",
			"Math", "abs", "pow", "exp", "min", "max", "floor", "ceil", "sin", "cos", "acos", "asin", "atan", "atan2", "sqrt",
			"String", "charCodeAt", "fromCharCode", "substr", "replace", "toUpperCase", "toLowerCase", "trim",
			"RegExp", "test", "exec", "match", "index",

			"nodeName", "childNodes", "firstChild", "nodeType", "TEXT_NODE", "ELEMENT_NODE", "nodeValue", "parentNode", "previousSibling", "nextSibling",
			"rangeCount", "getRangeAt", "collapse", "startContainer", "startOffset", "setStart", "setEnd", "removeAllRanges", "addRange",

			"document", "window", "getSelection", "createRange", "innerHTML", "textContent",

			"console", "log", 

			"JSON", "stringify",

			"defineProperty", "get", "set", "enumerable", "configurable", "hasOwnProperty",
			"apply", "call",

			"break", "case", "catch", "continue", "debugger", "default", "delete", "do", "else",
			"finally", "for", "function", "if", "in", "instanceof", "new", "return", "switch",
			"this", "throw", "try", "typeof", "var", "void", "while", "with",
		};

		static readonly Dictionary<string, string> Replacements = new Dictionary<string, string> ();

		static readonly Regex definePropertyRe = new Regex (@"Object\.defineProperty\s*\(([\w\.]+),\s*""(\w+)""", RegexOptions.Multiline);

		public static int Main(string[] args)
		{
			try	{

				foreach (var k in args.Skip(1))
					Keeps.Add(k);

				using (var input = new StreamReader (args[0])) {
					using (var output = new StreamWriter (Path.ChangeExtension(args[0], ".min.js"))) {
						Minify (input, output);
					}
				}

				using (var o = new StreamWriter (Path.ChangeExtension(args[0], ".min-names.txt"))) {
					foreach (var kv in Replacements) {
						o.WriteLine ("{0} = {1}", kv.Key, kv.Value);
					}
				}

				return 0;
			}
			catch (Exception ex) {
				Console.WriteLine (ex);
				return 1;
			}
		}

		static void Minify (TextReader input, TextWriter output)
		{
			var s = input.ReadToEnd();

			s = definePropertyRe.Replace (s, match => {

				var oldName = match.Groups[2].Value;
				var repl = GetReplacement (oldName);

				return "Object.defineProperty(" + match.Groups[1].Value + ",\"" + repl + "\"";

			});

			var wcount = 0;
			var needsWhiteSpace = false;
			Action writeWhite = () => {
				if (needsWhiteSpace) {
					output.Write (' ');
					needsWhiteSpace = false;
				}
			};

			var p = 0;
			var n = s.Length;
			var prevOp = ' ';
			var prevIsOp = false;
			while (p < n) {

				while (p < n && char.IsWhiteSpace (s [p])) {
					p++;
				}
				if (p >= n)
					return;

				var isOp = false;

				var ch = s[p];

				if (ch == '/' && p + 1 < n && (s [p + 1] == '/' || s [p + 1] == '*')) {
					//
					// Comment
					//
					if (s [p + 1] == '/') {
						while (p < n && s [p] != '\n')
							p++;
						p++;
					} else {
						var e = p + 2;
						while (e + 1 < n && (s [e] != '*' && s [e + 1] != '/'))
							e++;
						e += 2;
						p = e;
					}
				} else if (ch == '/' && prevIsOp && prevOp != ')') {
					//
					// Regular expression
					//
					var e = p + 1;
					while (e < n && (s [e] != ch)) {
						if (s [e] == '\\')
							e++;
						e++;
					}
					if (e < n)
						e++;
					output.Write (s.Substring (p, e - p));
					p = e;
					needsWhiteSpace = false;
				} else if (ch == '$' || ch == '_' || char.IsLetter (ch)) {
					//
					// Identifier
					//
					var e = p + 1;
					while (e < n && (s [e] == '$' || s [e] == '_' || char.IsLetterOrDigit (s [e]))) {
						e++;
					}
					var ident = s.Substring (p, e - p);
					writeWhite ();
					output.Write (GetReplacement (ident));
					p = e;
					needsWhiteSpace = true;
				} else if (char.IsDigit (ch) || (ch == '-' && p + 1 < n && char.IsDigit (s [p + 1]))) {
					//
					// Number
					//
					var e = p + 1;
					while (e < n && (s [e] == '.' || s [e] == 'E' || s [e] == 'e' || s [e] == '-' || char.IsDigit (s [e]))) {
						e++;
					}
					writeWhite ();
					output.Write (s.Substring (p, e - p));
					p = e;
					needsWhiteSpace = true;
				} else if (ch == '\'' || ch == '\"') {
					//
					// String
					//
					var e = p + 1;
					while (e < n && (s [e] != ch)) {
						if (s [e] == '\\')
							e++;
						e++;
					}
					if (e < n)
						e++;
					output.Write (s.Substring (p, e - p));
					p = e;
					needsWhiteSpace = false;
				}
				else if (char.IsWhiteSpace (ch)) {
					//
					// Should never get here, but just in case
					//
					output.Write (ch);
					p++;
				}
				else {
					//
					// Operators
					//
					output.Write (ch);
					p++;

					isOp = true;
					prevOp = ch;

					if (ch == ';') {
						wcount++;
						if (wcount == 10) {
							output.WriteLine ();
							wcount = 0;
						}
					}
					needsWhiteSpace = false;
				}

				prevIsOp = isOp;
			}
		}

		static string GetReplacement (string ident)
		{
			if (Keeps.Contains (ident))
				return ident;
			string r;
			if (!Replacements.TryGetValue (ident, out r)) {
				r = CreateIdent (Replacements.Count);
				Replacements.Add (ident, r);
			}
			return r;
		}

		static string CreateIdent (int index)
		{
			if (index == 0) return "a";
			var sb = new StringBuilder ();
			while (index > 0) {
				var r = index % 26;
				sb.Append ((char)('a' + r));
				index /= 26;
			}

			var s = sb.ToString ();
			if (Keeps.Contains (s)) {
				s = "_" + s;
			}

			return s;
		}

	}
}