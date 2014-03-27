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

class NObject
{
	Equals(other: NObject): boolean
	{
		return this === other;
	}
	GetHashCode(): number
	{
		return NString.GetHashCode (this.toString ());
	}
	ToString(): string
	{
		return this.toString ();
	}
	GetType(): Type
	{
		return new Type (this.constructor.toString().match(/function (\w*)/)[1]);
	}
	static ReferenceEquals(x: NObject, y: NObject): boolean
	{
		return x === y;
	}
}

class Exception extends NObject
{
	constructor()
	constructor(message: string)
	constructor(message?: string)
	{
		super();
	}
	
}

class NEvent<T>
{
	addEventListener(): void
	{
	}

	Add(listener: T): void
	{
		throw new NotImplementedException ();
	}

	Remove(listener: T): void
	{
		throw new NotImplementedException ();
	}

	ToMulticastFunction(): any
	{
		return function() {
			throw new NotImplementedException ();
		};
	}
}

class NArray
{
	static IndexOf<T> (values: T[], value: T): number
	{
		var i,
		    n = values.length;
		for (i = 0; i < n; i++) {
			if (values[i] === value)
				return i;
		}
		return -1;
	}
	static ToEnumerable<T> (array: T[]): IEnumerable<T>
	{
		throw new NotImplementedException ();
	}
	static Resize<T> (parray: T[][], newLength: number): T[]
	{
		throw new NotImplementedException ();
	}
}

class NNumber
{
	static Parse(text: string): number
	static Parse(text: string, style: NumberStyles, provider: IFormatProvider): number
	static Parse(text: string, provider: IFormatProvider): number
	static Parse(text: string, styleOrProvider?: any, provider?: IFormatProvider): number
	{
		throw new NotImplementedException ();
	}

	static ToString(num: number): string
	static ToString(num: number, provider: IFormatProvider): string
	static ToString(num: number, format: string, provider: IFormatProvider): string
	static ToString(num: number, providerOrFormat?: any, provider?: IFormatProvider): string
	{
		throw new NotImplementedException ();
	}
	static GetHashCode(num: number): number
	{
		return num;
	}
	static IsInfinity(num: number): boolean
	{
		throw new NotImplementedException ();
	}
	static TryParse(str: string, pvalue: number[]): boolean
	{
		throw new NotImplementedException ();
	}
	static IsNaN(num: number): boolean
	{
		return isNaN (num);
	}
}

class NBoolean
{
	static TryParse(str: string, pbool: boolean[]): boolean
	{
		throw new NotImplementedException;
	}
}

class NChar
{
	static IsWhiteSpace(ch: number): boolean
	{
		return ch === 32 || (ch >= 9 && ch <= 13) || ch === 133 || ch === 160;
	}
	static IsLetter(ch: number): boolean
	{
		throw new NotImplementedException();
	}
	static IsLetterOrDigit(ch: number): boolean
	{
		throw new NotImplementedException();
	}
	static IsDigit(ch: number): boolean
	static IsDigit(str: string, index: number): boolean
	static IsDigit(chOrStr: any, index?: number): boolean
	{
		throw new NotImplementedException();
	}
}

class NString
{
	static IndexOf (str: string, ch: number): number
	static IndexOf (str: string, ch: number, startIndex: number): number
	static IndexOf (str: string, sub: string): number
	static IndexOf (str: string, sub: string, startIndex: number): number
	static IndexOf (str: string, chOrSub: any, startIndex?: number): number
	{
		throw new NotImplementedException ();
	}
	static IndexOfAny (str: string, subs: number[]): number
	{
		throw new NotImplementedException ();
	}
	static GetHashCode(str: string): number
	{
		var hash = 0, i, l, ch;
		if (str.length == 0) return hash;
		for (i = 0, l = str.length; i < l; i++) {
			ch  = str.charCodeAt(i);
			hash  = ((hash<<5)-hash) + ch;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}
	static Replace(str: string, pattern: number, replacement: number): string
	static Replace(str: string, pattern: string, replacement: string): string
	static Replace(str: string, pattern: any, replacement: any): string
	{
		throw new NotImplementedException();
	}
	static Substring(str: string, startIndex: number): string
	static Substring(str: string, startIndex: number, length: number): string
	static Substring(str: string, startIndex: number, length?: number): string
	{
		throw new NotImplementedException();
	}
	static Remove(str: string, startIndex: number): string
	static Remove(str: string, startIndex: number, length: number): string
	static Remove(str: string, startIndex: number, length?: number): string
	{
		throw new NotImplementedException();
	}	
	static Trim(str: string): string
	{
		throw new NotImplementedException();
	}
	static TrimStart(str: string, trimChars: number[]): string
	{
		throw new NotImplementedException();
	}
	static TrimEnd(str: string, trimChars: number[]): string
	{
		throw new NotImplementedException();
	}
	static ToUpperInvariant(str: string): string
	{
		throw new NotImplementedException();
	}
	static ToLowerInvariant(str: string): string
	{
		throw new NotImplementedException();
	}
	static StartsWith(str: string, sub: string): boolean
	static StartsWith(str: string, sub: string, comp: StringComparison): boolean
	static StartsWith(str: string, sub: string, comp?: StringComparison): boolean
	{
		throw new NotImplementedException();
	}

	static Format(provider: IFormatProvider, format: string, args: any[]): string;
	static Format(format: string, arg0: any): string;
	static Format(format: string, arg0: any, arg1: any): string;
	static Format(format: string, arg0: any, arg1: any, arg2: any): string;
	static Format(providerOrFormat: any, formatOrArg0?: any, argsOrArg1?: any, arg2?: any): string
	{
		throw new NotImplementedException ();
	}
	static IsNullOrEmpty(str: string): boolean
	{
		return !str;
	}
	static Join(separator: string, parts: string[]): string
	{
		throw new NotImplementedException();
	}
	static Concat(parts: any[]): string
	{
		throw new NotImplementedException();
	}

	static FromChars(ch: number, count: number): string
	static FromChars(chars: number[]): string
	static FromChars(chOrChars: any, count?: number): string
	{
		throw new NotImplementedException ();
	}
}

enum StringComparison
{
	InvariantCultureIgnoreCase,
	Ordinal,
}

class NMath extends NObject
{
	static Truncate (value: number): number
	{
		throw new NotImplementedException ();
	}
	static Log (a: number): number
	static Log (a: number, newBase: number): number
	static Log (a: number, newBase?: number): number
	{
		throw new NotImplementedException ();
	}
	static Round (a: number): number
	static Round (a: number, decimals: number): number
	static Round (a: number, decimals?: number): number
	{
		throw new NotImplementedException ();
	}
	static Cosh (x: number): number
	{
		throw new NotImplementedException ();
	}
	static Sinh (x: number): number
	{
		throw new NotImplementedException ();
	}
	static Tanh (x: number): number
	{
		throw new NotImplementedException ();
	}
}

//
// System
//

class Type extends NObject
{
	constructor(public Name: string)
	{
		super();
	}
	Equals(obj: any): boolean
	{
		return (obj instanceof Type) && ((<Type>obj).Name === this.Name);
	}
}

class Nullable<T> extends NObject
{
	Value: T;
	HasValue: boolean;
	constructor(value: T)
	{
		super();
		this.Value = value;
	}
}

class DateTime extends NObject
{
	static get UtcNow(): DateTime
	{
		throw new NotImplementedException ();
	}

	static get Now(): DateTime
	{
		throw new NotImplementedException ();
	}

	static op_Subtraction(endTime: DateTime, startTime: DateTime): TimeSpan
	{
		throw new NotImplementedException ();
	}
}

class TimeSpan extends NObject
{
	private ticks: number;

	constructor(ticks: number)
	{
		super();
		this.ticks = ticks;
	}
	get TotalDays(): number
	{
		throw new NotImplementedException ();	
	}
	get Days(): number
	{
		throw new NotImplementedException ();	
	}
	get Hours(): number
	{
		throw new NotImplementedException ();	
	}
	get Minutes(): number
	{
		throw new NotImplementedException ();	
	}
	get Seconds(): number
	{
		throw new NotImplementedException ();	
	}
	static FromSeconds(seconds: number): TimeSpan
	{
		return new TimeSpan (seconds * 100e9);
	}
	static FromDays(days: number): TimeSpan
	{
		var hours = days*24;
		var minutes = 60*hours;
		return TimeSpan.FromSeconds (60*minutes);
	}
}

class NConsole extends NObject
{
	static WriteLine (line: string)
	static WriteLine (format: string, arg0: any)
	static WriteLine (lineOrFormat: string, arg0?: any)
	{
		throw new NotImplementedException ();
	}
	static Out: TextWriter;
}

class ArgumentException extends Exception
{
	constructor(name: string)
	constructor(message: string, name: string)
	constructor(nameOrMessage: string, name?: string)
	{
		super();
	}
}

class ArgumentNullException extends ArgumentException
{
	constructor(name: string)
	{
		super(name);
	}
}

class ArgumentOutOfRangeException extends ArgumentException
{
	constructor(name: string)
	{
		super(name);
	}
}

class EventArgs extends NObject
{
	
}

class EventHandler extends NObject
{
	Invoke (sender: any, e: EventArgs): void
	{		
	}
}


class InvalidOperationException extends Exception
{

}

class Environment
{
	static NewLine: string = "\n";
}

class Convert extends NObject
{
	static ToString (num: number, radix: number): string
	static ToString (num: number, provider: IFormatProvider): string
	static ToString (num: number, radixOrProvider: any): string
	{
		throw new NotImplementedException ();
	}
}

class NumberFormatInfo extends NObject
{
	NumberDecimalSeparator: string;
	NumberGroupSeparator: string;
}


interface IFormatProvider
{
	GetFormat(typeName: string): any;
}

enum NumberStyles
{
	HexNumber
}

class Encoding extends NObject
{
	static UTF8: Encoding = new Encoding();
}

class CultureInfo extends NObject implements IFormatProvider
{
	static InvariantCulture: CultureInfo = new CultureInfo("Invariant");
	static CurrentCulture: CultureInfo = CultureInfo.InvariantCulture;

	Name: string = "Invariant";

	GetFormat(typeName: string): any
	{
		throw new NotImplementedException ();
	}

	constructor(name: string)
	{
		super();
	}
}

class NotImplementedException extends Exception
{

}

class NotSupportedException extends Exception
{

}

class OverflowException extends Exception
{

}


//
// System.Collections.Generic
//

interface IEnumerable<T>
{
	GetEnumerator(): IEnumerator<T>;
}

interface IEnumerator<T> extends IDisposable
{
	MoveNext(): boolean;
	Current: T;
}

interface IDisposable
{
	Dispose(): void;
}

interface IList<T>
{
	Count: number;
	get_Item(index: number): T;
	set_Item(index: number, value: T): void;
}

class List<T> extends NObject implements IList<T>, IEnumerable<T>
{
	private array: T[] = new Array<T> ();

	constructor();
	constructor(capactiy: number);
	constructor(items: IEnumerable<T>);
	constructor(itemsOrCapacity?: any)
	{
		super();
		if (typeof itemsOrCapacity !== "undefined" && itemsOrCapacity.constructor == Number) {
			// We don't care
		}
		else if (itemsOrCapacity) {
			this.AddRange (itemsOrCapacity);
		}
	}

	Add (item: T)
	{
		this.array.push(item);
	}

	AddRange (items: IEnumerable<T>)
	{
		var e = items.GetEnumerator ();
		while (e.MoveNext) {
			this.Add (e.Current);
		}
	}

	get Count(): number
	{
		return this.array.length;
	}

	get_Item(index: number): T
	{
		return this.array[index];
	}

	set_Item(index: number, value: T): void
	{
		this.array[index] = value;
	}

	GetEnumerator(): List_Enumerator<T>
	{
		throw new NotImplementedException ();
	}

	RemoveAt(index: number): void
	{
		throw new NotImplementedException ();
	}

	RemoveRange(index: number, count: number): void
	{
		throw new NotImplementedException ();
	}

	Insert(index: number, item: T): void
	{
		throw new NotImplementedException ();
	}

	Clear(): void
	{
		throw new NotImplementedException ();
	}

	ToArray(): T[]
	{
		throw new NotImplementedException ();
	}

	RemoveAll(predicate: (item: T)=>boolean): void
	{
		throw new NotImplementedException ();
	}

	Reverse(): void
	{
		throw new NotImplementedException ();
	}

	IndexOf(item: T): number
	{
		throw new NotImplementedException ();
	}
}

class List_Enumerator<T> extends NObject implements IEnumerator<T>, IDisposable
{
	MoveNext(): boolean
	{
		throw new NotImplementedException ();
	}
	get Current(): T
	{
		throw new NotImplementedException ();	
	}
	Dispose(): void
	{
	}
}

class Stack<T> extends List<T>
{
	Push(item: T): void
	{
		this.Add(item);
	}
	Pop(): T
	{
		throw new NotImplementedException ();	
	}
}

class HashSet<T> extends NObject implements IEnumerable<T>
{
	private store = {};

	Add(item: T): void
	{
		throw new NotImplementedException ();	
	}

	GetEnumerator(): HashSet_Enumerator<T>
	{
		throw new NotImplementedException ();
	}

	Contains(item: T): boolean
	{
		throw new NotImplementedException ();
	}

	get Count(): number
	{
		throw new NotImplementedException ();
	}
}

class HashSet_Enumerator<T> extends NObject implements IEnumerator<T>, IDisposable
{
	MoveNext(): boolean
	{
		throw new NotImplementedException ();
	}
	get Current(): T
	{
		throw new NotImplementedException ();	
	}
	Dispose(): void
	{
	}
}

class KeyValuePair<K, V> extends NObject
{
	Key: K;
	Value: V;

	constructor(key: K, value: V)
	{
		super();
		this.Key = key;
		this.Value = value;
	}
}

interface IDictionary<K, V>
{

}

class Dictionary<K, V> extends NObject implements IDictionary<K, V>, IEnumerable<KeyValuePair<K, V>>
{
	private store = {};

	constructor();
	constructor(other: IDictionary<K, V>);
	constructor(other?: IDictionary<K, V>)
	{
		super();
	}

	get_Item(key: K): V
	{
		return <V>this.store[key+""];
	}

	set_Item(key: K, value: V)
	{
		this.store[key+""] = value;
	}

	Add(key: K, value: V)
	{
		if (this.ContainsKey (key)) {
			throw new InvalidOperationException ();
		}
		else {
			this.set_Item(key, value);
		}
	}

	ContainsKey (key: K): boolean
	{
		return this.store.hasOwnProperty(key+"");
	}

	GetEnumerator(): Dictionary_Enumerator<K,V>
	{
		throw new NotImplementedException ();
	}

	TryGetValue(key: K, pvalue: V[]): boolean
	{
		if (this.ContainsKey (key)) {
			pvalue[0] = this.store[key+""];
		}
		else {
			pvalue[0] = null;
			return false;
		}
	}

	Clear(): void
	{
		this.store = {};
	}

	get Count(): number
	{
		throw new NotImplementedException ();	
	}

	get Keys(): IEnumerable<K>
	{
		throw new NotImplementedException ();
	}
	
	get Values(): Dictionary_ValueCollection_Enumerator<K, V>
	{
		throw new NotImplementedException ();
	}

	Remove(key: K): void
	{
		throw new NotImplementedException ();
	}
}

class Dictionary_Enumerator<K, V> extends NObject implements IEnumerator<KeyValuePair<K,V>>, IDisposable
{
	MoveNext(): boolean
	{
		throw new NotImplementedException ();
	}
	get Current(): KeyValuePair<K,V>
	{
		throw new NotImplementedException ();	
	}
	Dispose(): void
	{
	}
}

class Dictionary_ValueCollection_Enumerator<K, V> extends NObject implements IEnumerator<V>, IEnumerable<V>, IDisposable
{
	MoveNext(): boolean
	{
		throw new NotImplementedException ();
	}
	get Current(): V
	{
		throw new NotImplementedException ();	
	}
	Dispose(): void
	{
	}
	GetEnumerator(): Dictionary_ValueCollection_Enumerator<K, V>
	{
		return this;
	}
}

class Regex extends NObject
{
	private re: RegExp;
	constructor(pattern: string)
	{
		super();
		this.re = new RegExp(pattern);
	}

	Match(input: string): Match
	{
		throw new NotImplementedException ();
	}

	Replace(input: string, repl: string): string
	{
		throw new NotImplementedException ();
	}

	IsMatch(input: string): boolean
	{
		throw new NotImplementedException ();
	}
}

class Match extends NObject
{
	Groups: GroupList = new GroupList ();
	Success: boolean = false;
}

class GroupList extends List<Group>
{
	get_Item (index: number): Group
	get_Item (name: string): Group
	get_Item (indexOrName: any): Group
	{
		throw new NotImplementedException ();
	}
}

class Group extends NObject
{
	Length: number = 0;
	Value: string = "";
	Index: number = 0;
}

class Stream extends NObject
{

}

class MemoryStream extends Stream
{
	ToArray(): number[]
	{
		throw new NotImplementedException ();
	}
}

class TextWriter extends NObject implements IDisposable
{
	Write(text: string): void
	{
		throw new NotSupportedException();
	}
	WriteLine(): void
	WriteLine(text: string): void
	WriteLine(text?: string): void
	{
		this.Write(text + Environment.NewLine);
	}
	Flush(): void
	{
		throw new NotSupportedException();
	}
	Dispose(): void
	{

	}
}

class StreamWriter extends TextWriter
{
	constructor(path: string);
	constructor(stream: Stream, encoding: Encoding);
	constructor(streamOrPath: any, encoding?: Encoding)
	{
		super();
	}
}

class BinaryWriter extends NObject
{
	BaseStream: Stream;

	constructor(baseStream: Stream)
	constructor(baseStream: Stream, encoding: Encoding)
	constructor(baseStream: Stream, encoding?: Encoding)
	{
		super();
	}

	Write(n: number): void
	Write(n: number[]): void
	Write(n: any): void
	{
		throw new NotImplementedException ();
	}

	Flush(): void
	{
		throw new NotImplementedException ();
	}	
}


class StringBuilder extends NObject
{
	Append(text: string): void
	Append(char: number): void
	Append(textOrChar: any): void
	{
		throw new NotImplementedException ();
	}

	AppendLine(): void
	AppendLine(text: string): void
	AppendLine(text?: string): void
	{
		this.Append(text + Environment.NewLine);
	}

	AppendFormat(text: string): void
	AppendFormat(format: string, arg0: any): void
	AppendFormat(format: string, arg0: any, arg1: any): void
	AppendFormat(format: string, arg0: any, arg1: any, arg2: any): void
	AppendFormat(textOrFormat: string, arg0?: any, arg1?: any, arg2?: any): void
	{
		throw new NotImplementedException ();
	}

	ToString(): string
	{
		throw new NotImplementedException ();
	}

	get Length(): number
	{
		throw new NotImplementedException ();	
	}
}

class TextReader extends NObject implements IDisposable
{
	ReadLine(): string
	{
		throw new NotSupportedException ();	
	}
	ReadToEnd(): string
	{
		throw new NotSupportedException ();
	}
	Dispose(): void
	{		
	}
}

class StringReader extends TextReader
{
	constructor(str: string)
	{
		super();
	}
}

class StringWriter extends TextWriter
{

}

//
// System.Linq
//

class Enumerable extends NObject
{
	static ToArray<T>(e: IEnumerable<T>): T[]
	{
		throw new NotImplementedException ();
	}

	static ToList<T>(e: T[]): List<T>
	static ToList<T>(e: IEnumerable<T>): List<T>
	static ToList<T>(e: any): List<T>
	{
		throw new NotImplementedException ();
	}

	static Empty<T>(): IEnumerable<T>
	{
		return new List<T> ();
	}

	static Select<T,U>(e: T[], selector: (T)=>U): IEnumerable<U>
	static Select<T,U>(e: IEnumerable<T>, selector: (T)=>U): IEnumerable<U>
	static Select<T,U>(e: any, selector: (T)=>U): IEnumerable<U>
	{
		throw new NotImplementedException ();
	}

	static SelectMany<T,U>(e: T[], selector: (T)=>IEnumerable<U>): IEnumerable<U>
	static SelectMany<TSource,TResult>(e: IEnumerable<TSource>, selector: (TSource)=>IEnumerable<TResult>): IEnumerable<TResult>
	static SelectMany<TSource,TResult>(e: IEnumerable<TSource>, selector: (TSource, number)=>IEnumerable<TResult>): IEnumerable<TResult>
	static SelectMany<TSource,TCollection,TResult>(e: IEnumerable<TSource>, selector: (TSource)=>IEnumerable<TCollection>, comb: (TSource,TCollection)=>TResult): IEnumerable<TResult>
	static SelectMany<T,U>(e: any, selector: any, comb?: any): IEnumerable<U>
	{
		throw new NotImplementedException ();
	}

	static Where<T>(e: T[], p: (a: T)=>boolean): IEnumerable<T>
	static Where<T>(e: IEnumerable<T>, p: (a: T)=>boolean): IEnumerable<T>
	static Where<T>(e: any, p: (a: T)=>boolean): IEnumerable<T>
	{
		throw new NotImplementedException ();
	}

	static OrderBy<T, U>(e: IEnumerable<T>, s: (a: T)=>U): IEnumerable<T>
	{
		throw new NotImplementedException ();		
	}
	static ThenBy<T, U>(e: IEnumerable<T>, s: (a: T)=>U): IEnumerable<T>
	{
		throw new NotImplementedException ();		
	}

	static Concat<T>(x: T[], y: T[]): IEnumerable<T>
	static Concat<T>(x: IEnumerable<T>, y: IEnumerable<T>): IEnumerable<T>
	static Concat<T>(x: any, y: any): IEnumerable<T>
	{
		throw new NotImplementedException ();
	}

	static Take<T>(x: T[], count: number): IEnumerable<T>
	static Take<T>(x: IEnumerable<T>, count: number): IEnumerable<T>
	static Take<T>(x: any, count: number): IEnumerable<T>
	{
		throw new NotImplementedException ();
	}

	static Skip<T>(x: T[], count: number): IEnumerable<T>
	static Skip<T>(x: IEnumerable<T>, count: number): IEnumerable<T>
	static Skip<T>(x: any, count: number): IEnumerable<T>
	{
		throw new NotImplementedException ();
	}

	static Distinct<T>(e: IEnumerable<T>): IEnumerable<T>
	{
		throw new NotImplementedException ();
	}

	static Cast<T>(e: IEnumerable<T>): IEnumerable<T>
	{
		return e;
	}

	static FirstOrDefault<T>(e: T[]): T
	static FirstOrDefault<T>(e: IEnumerable<T>): T
	static FirstOrDefault<T>(e: IEnumerable<T>, p: (a: T)=>boolean): T
	static FirstOrDefault<T>(e: any, p?: (a: T)=>boolean): T
	{
		throw new NotImplementedException ();
	}

	static First<T>(e: T[]): T
	static First<T>(e: IEnumerable<T>): T
	static First<T>(e: IEnumerable<T>, p: (a: T)=>boolean): T
	static First<T>(e: any, p?: (a: T)=>boolean): T
	{
		throw new NotImplementedException ();
	}

	static Any<T>(e: IEnumerable<T>, s: (a: T)=>boolean): boolean
	static Any<T>(e: T[], s: (a: T)=>boolean): boolean
	static Any<T>(e: any, s: (a: T)=>boolean): boolean
	{
		throw new NotImplementedException ();
	}

	static All<T>(e: IEnumerable<T>, s: (a: T)=>boolean): boolean
	static All<T>(e: T[], s: (a: T)=>boolean): boolean
	static All<T>(e: any, s: (a: T)=>boolean): boolean
	{
		throw new NotImplementedException ();
	}

	static Count<T>(e: IEnumerable<T>): number
	static Count<T>(e: T[]): number
	static Count<T>(e: any): number
	{
		throw new NotImplementedException ();
	}

	static Sum<T>(e: IEnumerable<T>, s: (a: T)=>number): number
	static Sum<T>(e: T[], s: (a: T)=>number): number
	static Sum<T>(e: any, s: (a: T)=>number): number
	{
		throw new NotImplementedException ();
	}

	static Max<T>(e: IEnumerable<T>): number
	static Max<T>(e: T[]): number
	static Max<T>(e: IEnumerable<T>, s: (a: T)=>number): number
	static Max<T>(e: T[], s: (a: T)=>number): number
	static Max<T>(e: any, s?: (a: T)=>number): number
	{
		throw new NotImplementedException ();
	}

	static Min<T>(e: IEnumerable<T>): number
	static Min<T>(e: T[]): number
	static Min<T>(e: IEnumerable<T>, s: (a: T)=>number): number
	static Min<T>(e: T[], s: (a: T)=>number): number
	static Min<T>(e: any, s?: (a: T)=>number): number
	{
		throw new NotImplementedException ();
	}

	static ToDictionary<T,K,V>(e: IEnumerable<T>, k: (T)=>K, v: (T)=>V): Dictionary<K,V>
	{
		throw new NotImplementedException ();
	}
}


interface INotifyPropertyChanged
{
	PropertyChanged: NEvent<(sender: any, e: PropertyChangedEventArgs) => void>;
}

class PropertyChangedEventArgs extends EventArgs
{
	constructor(name: string)
	{
		super();
	}
}


class Debug extends NObject
{
	static WriteLine (text: string): void
	{

	}
}

class Thread extends NObject
{
	static CurrentThread: Thread = new Thread();

	private static nextId: number = 1;

	ManagedThreadId: number;

	constructor()
	{
		super();
		this.ManagedThreadId = Thread.nextId++;
	}
}

class ThreadPool extends NObject
{
	static QueueUserWorkItem (workItem: (a:any)=>void): void
	{
		throw new NotImplementedException ();
	}
}

class Monitor extends NObject
{
	static Enter(lock: any): void
	{

	}

	static Exit(lock: any): void
	{

	}
}

class Interlocked extends NObject
{
	static CompareExchange(location1: number[], value: number, comparand: number): number
	{
		var v: number = location1[0];
		if (v === comparand)
			location1[0] = value;
		return v;
	}
}

class WebClient extends NObject
{
	DownloadString(url: string): string
	{
		throw new NotImplementedException ();
	}
}

