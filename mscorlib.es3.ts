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
		return this.GetType ().Name;
	}
	toString(): string
	{
		return this.ToString ();
	}
	GetType(): Type
	{
		return new Type (this.constructor.toString().match(/function (\w*)/)[1]);
	}
	static ReferenceEquals(x: NObject, y: NObject): boolean
	{
		return x === y;
	}
	static GenericEquals(x: any, y: any): boolean
	{
		if (typeof x === "object") return x.Equals(y);
		return x === y;
	}
	static GenericToString(x: any): string
	{
		if (typeof x === "object") return x.ToString();
		return x.toString ();
	}
	static GenericGetHashCode(x: any): number
	{		
		if (typeof x === "object") return x.GetHashCode();
		return NString.GetHashCode (this.toString ());
	}
}

class Exception extends NObject
{
	private _message: string;
	GetMessage(): string
	{
		return this._message;
	}
	constructor(message: string = "")
	{
		super();
		this._message = message;
	}
	ToString(): string
	{
		return "Exception: " + this._message;
	}
}

class NEvent<T>
{
	private listeners: T[] = new Array<T> ();

	Add(listener: T): void
	{
		this.listeners.push(listener);
	}

	Remove(listener: T): void
	{
		var index = this.listeners.indexOf(listener);
		if (index < 0) return;
		this.listeners.splice(index, 1);
	}

	ToMulticastFunction(): any
	{
		if (this.listeners.length === 0)
			return null;
		return function() {
			for (var i in this.listeners) {
				this.listeners[i].call (arguments);
			}
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
		return new Array_Enumerable<T> (array);
	}
	static Resize<T> (parray: T[][], newLength: number): void
	{
		if (parray[0] === null) {
			parray[0] = new Array<T> (newLength);
			return;
		}
		if (parray[0].length === newLength) {
			return;
		}
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
		return parseFloat(text);
	}

	static ToString(num: number): string
	static ToString(num: number, provider: IFormatProvider): string
	static ToString(num: number, format: string, provider: IFormatProvider): string
	static ToString(num: number, providerOrFormat?: any, provider?: IFormatProvider): string
	{
		return num.toString();
	}
	static GetHashCode(num: number): number
	{
		return num;
	}
	static IsInfinity(num: number): boolean
	{
		return num === Infinity;
	}
	static TryParse(str: string, pvalue: number[]): boolean
	{
		try {
			pvalue[0] = parseFloat (str);
			return true;
		}
		catch (ex) {
			pvalue[0] = 0;
			return false;
		}
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
	static GetHashCode(bool: boolean): number
	{
		return bool ? 1 : 0;
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
		return (65 <= ch && ch <=  90) || (97 <= ch && ch <= 122) || (ch >= 128 && ch !== 133 && ch !== 160);
	}
	static IsLetterOrDigit(ch: number): boolean
	{
		return (48 <= ch && ch <= 57) || (65 <= ch && ch <=  90) || (97 <= ch && ch <= 122) || (ch >= 128 && ch !== 133 && ch !== 160);
	}
	static IsDigit(ch: number): boolean
	static IsDigit(str: string, index: number): boolean
	static IsDigit(chOrStr: any, index?: number): boolean
	{
		if (arguments.length == 1) {
			return 48 <= chOrStr && chOrStr <= 57;
		}
		else {
			var ch = chOrStr.charCodeAt(index);
			return 48 <= ch && ch <= 57;
		}
	}
}

class NString
{
    static Empty = "";
	static _EscapedChars: Array<string> = [
		'\\','^','$','*','+','?','.','(',')',':','=','!','|','{','}',',','[',']'
	];
	static IndexOf (str: string, ch: number): number
	static IndexOf (str: string, ch: number, startIndex: number): number
	static IndexOf (str: string, sub: string): number
	static IndexOf (str: string, sub: string, startIndex: number): number
	static IndexOf (str: string, chOrSub: any, startIndex?: number): number
	{
		var sub: string;
		if (chOrSub.constructor == Number) {
			sub = String.fromCharCode (chOrSub);
		}
		else {
			sub = chOrSub;
		}
		return str.indexOf(sub);
	}
	static IndexOfAny (str: string, subs: number[]): number
	{
		for (var i = 0; i < str.length; ++i) {
			var c = str.charCodeAt(i);
			for (var j = 0; j < subs.length; ++j) {
				if (c == subs[j])
					return i;
			}
		}
		return -1;
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
		var ps = (pattern.constructor === Number) ? String.fromCharCode (pattern) : pattern;
		var rs = (replacement.constructor === Number) ? String.fromCharCode (replacement) : replacement;
		return str.replace(ps, rs);
	}
	static Substring(str: string, startIndex: number): string
	static Substring(str: string, startIndex: number, length: number): string
	static Substring(str: string, startIndex: number, length: number = -1): string
	{
		return length < 0 ? str.substr(startIndex) : str.substr(startIndex, length);
	}
	/*static Remove(str: string, startIndex: number): string*/
	static Remove(str: string, startIndex: number, length: number): string
    {
		if (typeof length === undefined)
		{
			return str.substring(0, startIndex);
		}
		else
		{
			return str.substring(0, startIndex) + str.substring(startIndex + length);
		}
    }
	/*static Remove(str: string, startIndex: number, length?: number): string
	{
		throw new NotImplementedException(); // do we care that ts->js compiler will get rid of this syntactic sugar?
	}*/
	static Trim(str: string): string
	{
		return str.trim();
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
		return str.toUpperCase ();
	}
	static ToLowerInvariant(str: string): string
	{
		return str.toLowerCase ();
	}
	static Contains(str: string, sub: string): boolean
	{
		return str.indexOf (sub) >= 0;
	}
	static StartsWith(str: string, sub: string): boolean
	static StartsWith(str: string, sub: string, comp: StringComparison): boolean
	static StartsWith(str: string, sub: string, comp?: StringComparison): boolean
	{
		return str.indexOf (sub) === 0;
	}
	static EndsWith(str: string, sub: string): boolean
	static EndsWith(str: string, sub: string, comp: StringComparison): boolean
	static EndsWith(str: string, sub: string, comp?: StringComparison): boolean
	{
		return str.indexOf (sub) === str.length - sub.length;
	}

	static Format(format: string, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): string
    {
		if (arg0.constructor === Array)
        {
            var s = format,
            i = arg0.length;
            while (i--) {
                s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arg0[i]);
            }
            return s;
        }
		else
        {
            var args = [arg0, arg1, arg2, arg3, arg4, arg5];
            return NString.Format(format, args);
        }
	}
	static IsNullOrEmpty(str: string): boolean
	{
		return !str;
	}
	static Join(separator: string, parts: string[]): string
	{
		return parts.join(separator);
	}
	static Concat(parts: any[]): string
	{
		throw new NotImplementedException();
	}

	static FromChars(ch: number, count: number): string
	static FromChars(chars: number[]): string
	static FromChars(chOrChars: any, count: number = 1): string
	{
		if (chOrChars.constructor === Number) {
			var r = String.fromCharCode (chOrChars);
			for (var i = 2; i < count; i++) {
				r += String.fromCharCode (chOrChars);
			}
			return r;
		}
		throw new NotImplementedException ();
	}
	static Split(str: string, separator: NChar[]): string[]
	{
		var regexp: string = '';
		separator.forEach((char: number) => {
			var value = String.fromCharCode(char);
			if(~NString._EscapedChars.indexOf(value)){
				regexp += '\\';
			}
			regexp += value;
		});

		var pattern = new RegExp(`[${regexp}]`);
		return str.split(pattern);
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
		return value >= 0 ? Math.floor(value) : Math.ceil(value);
	}
	static Log (a: number): number
	static Log (a: number, newBase: number): number
	static Log (a: number, newBase: number = Math.E): number
	{
		if (newBase === Math.E)
			return Math.log (a);
		return Math.log(a) / Math.log(newBase);
	}
	static Round (a: number): number
	static Round (a: number, decimals: number): number
	static Round (a: number, decimals: number = 0): number
	{
		if (decimals === 0)
			return Math.round(a);
		var s = Math.pow(10, decimals);
		return Math.round(a * s) / s;
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
	private _value: T;
	GetValue(): T
	{
		return this._value;
	};
	GetHasValue(): boolean { return this._value != null; }
	constructor(value: T = null)
	{
		super();
		this._value = value;
	}
}

enum DateTimeKind
{
	Local,
	Unspecified,
	Utc
}

enum DayOfWeek {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}

class DateTime extends NObject
{
	private dt: Date;
	private kind: DateTimeKind;
	GetKind(): DateTimeKind { return this.kind; }
	GetYear(): number { return this.kind === DateTimeKind.Utc ? this.dt.getUTCFullYear() : this.dt.getFullYear(); }
	GetMonth(): number { return this.kind === DateTimeKind.Utc ? this.dt.getUTCMonth()+1 : this.dt.getMonth()+1; }
	GetDay(): number { return this.kind === DateTimeKind.Utc ? this.dt.getUTCDate() : this.dt.getDate(); }
	GetDayOfWeek(): DayOfWeek { return this.dt.getDay(); }
	constructor()
	constructor(year: number, month: number, day: number)
	constructor(year: number = 1, month: number = 1, day: number = 1)
	{
		super();
		this.dt = new Date(year, month-1, day);
		this.kind = DateTimeKind.Unspecified;
	}	
	ToString(): string
	{
		return this.kind === DateTimeKind.Utc ? this.dt.toUTCString() : this.dt.toString();
	}
	static GetUtcNow(): DateTime
	{
		var d = new DateTime();
		d.dt = new Date();
		d.kind = DateTimeKind.Utc;
		return d;
	}
	static GetNow(): DateTime
	{
		var d = new DateTime();
		d.dt = new Date();
		d.kind = DateTimeKind.Local;
		return d;
	}
	static op_Subtraction(x: DateTime, y: DateTime): TimeSpan
	{
		return TimeSpan.FromSeconds ((x.dt.getTime() - y.dt.getTime()) / 1000);
	}
	static op_GreaterThanOrEqual(x: DateTime, y: DateTime): boolean
	{
		return x.dt >= y.dt;
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
	GetTotalDays(): number
	{
		throw new NotImplementedException ();
	}
	GetDays(): number
	{
		throw new NotImplementedException ();
	}
	GetHours(): number
	{
		throw new NotImplementedException ();
	}
	GetMinutes(): number
	{
		throw new NotImplementedException ();
	}
	GetSeconds(): number
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
	static op_GreaterThanOrEqual(x: TimeSpan, y: TimeSpan)
	{
		return x.ticks >= y.ticks;
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
    static ToUInt16 (str: string) : number
    {
        var value = Number(str);
        if (value < 0) value = 0;
        if (value >= 0xFFFF) value = 0xFFFF;
        return value;
    }
    
    static ToUInt32 (str: string) : number
    {
        var value = Number(str);
        if (value < 0) value = 0;
        if (value >= 0xFFFFFFFF) value = 0xFFFFFFFF;
        return value;
    }
    
	static ToString (num: number, radix: number): string
	static ToString (num: number, provider: IFormatProvider): string
	static ToString (num: number, radixOrProvider: any): string
	{
		throw new NotImplementedException ();
	}
}

class NumberFormatInfo extends NObject
{
	NumberDecimalSeparator: string = ".";
	NumberGroupSeparator: string = ",";
}


interface IFormatProvider
{
	GetFormat(type: Type): any;
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

	private nfi: NumberFormatInfo = new NumberFormatInfo ();

	GetFormat(type: Type): any
	{
		if (type.Name === "NumberFormatInfo") {
			return this.nfi;
		}
		return null;
	}

	constructor(name: string)
	{
		super();
	}
}

class NotImplementedException extends Exception
{
	constructor(message: string = "Not implemented")
	{
		super(message);
	}
}

class NotSupportedException extends Exception
{
	constructor(message: string = "Not supported")
	{
		super(message);
	}
}

class OverflowException extends Exception
{
	constructor()
	{
		super("Overflow");
	}
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
	GetCurrent(): T;
}

interface IDisposable
{
	Dispose(): void;
}

interface IList<T>
{
	GetCount(): number;
	get_Item(index: number): T;
	set_Item(index: number, value: T): void;
}

class List<T> extends NObject implements IList<T>, IEnumerable<T>
{
	array: T[] = new Array<T> (); // Public to help the enumerator

	constructor();
	constructor(capactiy: number);
	constructor(items: IEnumerable<T>);
	constructor(itemsOrCapacity?: any)
	{
		super();
		if (arguments.length == 1 && itemsOrCapacity.constructor !== Number) {
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
		while (e.MoveNext ()) {
			this.Add (e.GetCurrent());
		}
	}

	GetCount(): number
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
		return new List_Enumerator<T> (this);
	}

	RemoveAt(index: number): void
	{
		this.array.splice(index, 1);
	}

	RemoveRange(index: number, count: number): void
	{
		throw new NotImplementedException ();
	}

	Insert(index: number, item: T): void
	{
		this.array.splice(index, 0, item);
	}

	Clear(): void
	{
		this.array = new Array<T> ();
	}

	ToArray(): T[]
	{
		return this.array.slice(0);
	}

	RemoveAll(predicate: (item: T)=>boolean): void
	{
		var newArray: T[] = new Array<T> ();

		for (var i = 0; i < this.array.length; i++) {
			if (!predicate(this.array[i]))
				newArray.push(this.array[i]);
		}

		this.array = newArray;
	}

	Reverse(): void
	{
		throw new NotImplementedException ();
	}

	IndexOf(item: T): number
	{
		return this.array.indexOf(item);
	}
}

class Array_Enumerator<T> extends NObject implements IEnumerator<T>, IDisposable
{
	private array: T[];
	private index: number = -1;
	constructor (array: T[])
	{
		super();
		this.array = array;
	}
	MoveNext(): boolean
	{
		this.index++;
		return this.index < this.array.length;
	}
	GetCurrent(): T
	{
		return this.array[this.index];
	}
	Dispose(): void
	{
	}
}

class Array_Enumerable<T> extends NObject implements IEnumerable<T>
{
	private array: T[];
	constructor (array: T[])
	{
		super();
		this.array = array;
	}
	GetEnumerator(): Array_Enumerator<T>
	{
		return new Array_Enumerator<T> (this.array);
	}
}

class List_Enumerator<T> extends Array_Enumerator<T>
{
	constructor (list: List<T>)
	{
		super(list.array);
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

	GetCount(): number
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
	GetCurrent(): T
	{
		throw new NotImplementedException ();	
	}
	Dispose(): void
	{
	}
}

class KeyValuePair<K, V> extends NObject
{
	private key: K;
	private value: V;

	GetKey(): K
	{
		return this.key;
	}
	GetValue(): V
	{
		return this.value;
	}

	constructor(key: K, value: V)
	{
		super();
		this.key = key;
		this.value = value;
	}
}

interface IDictionary<K, V>
{

}

class Dictionary<K, V> extends NObject implements IDictionary<K, V>, IEnumerable<KeyValuePair<K, V>>
{	
	private keys = {};
	private values = {};

	constructor();
	constructor(other: IDictionary<K, V>);
	constructor(other?: IDictionary<K, V>)
	{
		super();
	}

	get_Item(key: K): V
	{
		return <V>this.values[this.GetKeyString (key)];
	}

	set_Item(key: K, value: V)
	{
		var ks = this.GetKeyString (key);
		if (!this.values.hasOwnProperty(ks)) {
			this.keys[ks] = key;
		}
		this.values[ks] = value;
	}

	Add(key: K, value: V)
	{
		var ks = this.GetKeyString (key);
		if (this.values.hasOwnProperty(ks)) {
			throw new InvalidOperationException ();
		}
		else {
			this.keys[ks] = key;
			this.values[ks] = value;
		}
	}

	private GetKeyString(key: K): string
	{
		if (key === null)
			return "null";
		if (typeof key === "undefined")
			return "undefined";
		return key+"";
	}

	ContainsKey (key: K): boolean
	{
		return this.values.hasOwnProperty(this.GetKeyString (key));
	}

	TryGetValue(key: K, pvalue: V[]): boolean
	{
		var ks = this.GetKeyString (key);
		if (this.values.hasOwnProperty(ks)) {
			pvalue[0] = this.values[ks];
			return true;
		}
		else {
			pvalue[0] = null;
			return false;
		}
	}

	Remove(key: K): void
	{
		var ks = this.GetKeyString (key);
		delete this.values[ks];
		delete this.keys[ks];
	}

	Clear(): void
	{
		this.values = {};
		this.keys = {};
	}

	GetCount(): number
	{
		return Object.keys(this.values).length;
	}
	GetEnumerator(): Dictionary_Enumerator<K,V>
	{
		var kvs = new List<KeyValuePair<K,V>>();
		for (var ks in this.values) {
			kvs.Add (new KeyValuePair<K,V> (this.keys[ks], this.values[ks]));
		}
		return new Dictionary_Enumerator<K,V> (kvs);
	}
	GetKeys(): Dictionary_KeyCollection<K, V>
	{
		var keys = new Dictionary_KeyCollection<K, V> ();
		for (var ks in this.keys) {
			keys.Add (this.keys[ks]);
		}
		return keys;
	}
	GetValues(): Dictionary_ValueCollection<K, V>
	{
		var vals = new Dictionary_ValueCollection<K, V> ();
		for (var ks in this.values) {
			vals.Add (this.values[ks]);
		}
		return vals;
	}
}

class Dictionary_Enumerator<K, V> extends List_Enumerator<KeyValuePair<K,V>>
{
	constructor (list: List<KeyValuePair<K,V>>)
	{
		super(list);
	}
}

class Dictionary_KeyCollection<K, V> extends List<K>
{
}

class Dictionary_KeyCollection_Enumerator<K, V> extends List_Enumerator<K>
{
	constructor (list: List<K>)
	{
		super(list);
	}
}

class Dictionary_ValueCollection<K, V> extends List<V>
{
}

class Dictionary_ValueCollection_Enumerator<K, V> extends List_Enumerator<V>
{
	constructor (list: List<V>)
	{
		super(list);
	}
}

class Regex extends NObject
{
	private re: RegExp;
	constructor(pattern: string)
	{
		super();
		this.re = new RegExp(pattern, "g");
	}

	Match(input: string): Match
	{
		var m = new Match();
		var r = this.re.exec(input);
		if (r) {
			var loc = r.index;
			for (var i = 0; i < r.length; ++i) {
				var text = "";
				if (typeof r[i] === "undefined") {}
				else if (r[i].constructor === String)
					text = r[i];
				m._AddGroup (new Group (text, loc));
				if (i !== 0)
					loc += text.length;
			}
			m._SetSuccess(true);
		}
		return m;
	}

	Replace(input: string, repl: string): string
	{
		return input.replace(this.re, repl);
	}

	IsMatch(input: string): boolean
	{
		return this.re.test(input);
	}
}

class Match extends NObject
{
	private _groupcoll: List<Group>;
	private _success: boolean = false;
	GetGroups(): List<Group>
	{
		if (this._groupcoll == null) {
			this._groupcoll = new List<Group> ();
		}
		return this._groupcoll;
	}
	_AddGroup(group: Group) {
		this._groupcoll.Add(group);
	}
	GetSuccess(): boolean
	{
		return this._success;
	}
	_SetSuccess(value: boolean)
	{
		this._success = value;
	}
}

class Group extends NObject
{
	private _length: number;
	private _value: string;
	private _index: number;

	GetLength(): number
	{
		return this._length;
	}
	GetValue(): string
	{
		return this._value;
	}
	GetIndex(): number
	{
		return this._index
	}
	constructor(value: string, index: number)
	{
		super();
		this._value = value||"";
		this._length = this._value.length;
		this._index = index;
	}
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
	private parts: string[] = new Array<string> ();

	Append(text: string): void
	Append(char: number): void
	Append(textOrChar: any): void
	{
		var text: string = (textOrChar.constructor == Number) ? String.fromCharCode (textOrChar) : textOrChar;
		this.parts.push(text);
	}

	AppendLine(): void
	AppendLine(text: string): void
	AppendLine(text: string = null): void
	{
		if (text !== null) {
			this.parts.push(text);
		}
		this.parts.push(Environment.NewLine);
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
		return this.parts.join("");
	}

	GetLength(): number
	{
		var len = 0;
		for (var i = 0; i < this.parts.length; i++) {
			len += this.parts[i].length;
		}
		return len;
	}

	get_Item(index: number): number
	{
		var o = 0;
		for (var i = 0; i < this.parts.length; ++i) {
			var p = this.parts[i];
			if (index < o + p.length) {
				return p.charCodeAt (index - o);
			}
			o += p.length;
		}
		return 0;
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
	private str: string;
	private pos: number;	
	constructor(str: string)
	{
		super();
		this.str = str;
		this.pos = 0;
	}
	ReadLine(): string
	{
		var p = this.pos;
		if (p >= this.str.length)
			return null;
		var end = p;
		while (end < this.str.length && this.str.charCodeAt(end) !== 10) {
			end++;
		}
		var tend = end;
		if (tend > p && this.str.charCodeAt(tend-1) == 13) {
			tend--;
		}
		var r = this.str.substr(p, tend - p);
		this.pos = end + 1;
		return r;
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

	static ToList<T>(e: IEnumerable<T>): List<T>
	{
		return new List<T>(e);
	}

	static Empty<T>(): IEnumerable<T>
	{
		return new List<T> ();
	}

	static Range(start: number, count: number): IEnumerable<number>
	{
		var end = start + count;
		var r = new List<number> ();
		for (var i = start; i < end; i++) {
			r.Add (i);
		}
		return r;
	}

	static Select<T,U>(e: IEnumerable<T>, selector: (T)=>U): IEnumerable<U>
	{
		var r = new List<U>();
		var i = e.GetEnumerator();
		while (i.MoveNext()) {
			r.Add(selector(i.GetCurrent()));
		}
		return r;
	}

	static SelectMany<TSource,TResult>(e: IEnumerable<TSource>, selector: (TSource)=>IEnumerable<TResult>): IEnumerable<TResult>
	static SelectMany<TSource,TResult>(e: IEnumerable<TSource>, selector: (TSource, number)=>IEnumerable<TResult>): IEnumerable<TResult>
	static SelectMany<TSource,TCollection,TResult>(e: IEnumerable<TSource>, selector: (TSource)=>IEnumerable<TCollection>, comb: (TSource,TCollection)=>TResult): IEnumerable<TResult>
	static SelectMany<T,U>(e: any, selector: any, comb?: any): IEnumerable<U>
	{
		throw new NotImplementedException ();
	}

	static Where<T>(e: IEnumerable<T>, p: (a: T)=>boolean): IEnumerable<T>
	{
		var r = new List<T>();
		var i = e.GetEnumerator();
		while (i.MoveNext()) {
			if (p(i.GetCurrent()))
				r.Add(i.GetCurrent());
		}
		return r;
	}

	static OrderBy<T, U>(e: IEnumerable<T>, s: (a: T)=>U): IEnumerable<T>
	{
		var r = new List<T>();
		var i = e.GetEnumerator();
		while (i.MoveNext()) {
			r.Add(i.GetCurrent());
		}
		r.array.sort(function(x, y) {
			var sx = s(x);
			var sy = s(y);
			if (sx === sy) return 0;
			if (sx < sy) return -1;
			return 1;
		});
		return r;
	}
	static OrderByDescending<T, U>(e: IEnumerable<T>, s: (a: T)=>U): IEnumerable<T>
	{
		var r = new List<T>();
		var i = e.GetEnumerator();
		while (i.MoveNext()) {
			r.Add(i.GetCurrent());
		}
		r.array.sort(function(x, y) {
			var sx = s(x);
			var sy = s(y);
			if (sx === sy) return 0;
			if (sx < sy) return 1;
			return -1;
		});
		return r;
	}
	static ThenBy<T, U>(e: IEnumerable<T>, s: (a: T)=>U): IEnumerable<T>
	{
		return Enumerable.OrderBy<T, U>(e, s);
	}

	static Concat<T>(x: IEnumerable<T>, y: IEnumerable<T>): IEnumerable<T>
	{
		var r = new List<T> (x);
		r.AddRange (y);
		return r;
	}

	static Take<T>(e: IEnumerable<T>, count: number): IEnumerable<T>
	{
		var r = new List<T>();
		var i = e.GetEnumerator();
		while (r.GetCount() < count && i.MoveNext()) {
			r.Add(i.GetCurrent());
		}
		return r;
	}

	static Skip<T>(e: IEnumerable<T>, count: number): IEnumerable<T>
	{
		var r = new List<T>();
		var i = e.GetEnumerator();
		var j = 0;
		while (i.MoveNext()) {
			if (j >= count)
				r.Add(i.GetCurrent());
			j++;
		}
		return r;
	}

	static Distinct<T>(e: IEnumerable<T>): IEnumerable<T>
	{
		var d = new Dictionary<T,T> ();
		var i = e.GetEnumerator();
		while (i.MoveNext()) {
			d.set_Item(i.GetCurrent(), null);
		}
		return d.GetKeys();
	}

	static Cast<T>(e: IEnumerable<T>): IEnumerable<T>
	{
		return e;
	}

	static OfType<U>(e: any): IEnumerable<U>
	{
		// Doesn't work. Stupid type erasure.
		// var i = e.GetEnumerator();
		// var r = new List<U>();
		// while (i.MoveNext()) {
		// 	if (i.GetCurrent() instanceof U) r.Add (i.GetCurrent());
		// }
		// return r;
		throw new NotImplementedException ();
	}

	static Contains<T>(e: IEnumerable<T>, val: T): boolean
	{
		var i = e.GetEnumerator();
		while (i.MoveNext()) {
			if (i.GetCurrent() === val)
				return true;
		}
		return false;
	}

	static FirstOrDefault<T>(e: IEnumerable<T>): T
	static FirstOrDefault<T>(e: IEnumerable<T>, p: (a: T)=>boolean): T
	static FirstOrDefault<T>(e: any, p: (a: T)=>boolean = null): T
	{
		var i = e.GetEnumerator();
		while (i.MoveNext()) {
			if (p === null || p(i.GetCurrent()))
				return i.GetCurrent();
		}
		return null;
	}

	static LastOrDefault<T>(e: IEnumerable<T>): T
	static LastOrDefault<T>(e: IEnumerable<T>, p: (a: T)=>boolean): T
	static LastOrDefault<T>(e: any, p: (a: T)=>boolean = null): T
	{
		var i = e.GetEnumerator();
		var last : T = null;
		while (i.MoveNext()) {
			if (p === null || p(i.GetCurrent()))
				last = i.GetCurrent();
		}
		return last;
	}

	static Last<T>(e: IEnumerable<T>): T
	static Last<T>(e: IEnumerable<T>, p: (a: T)=>boolean): T
	static Last<T>(e: any, p: (a: T)=>boolean = null): T
	{
		var i = e.GetEnumerator();
		var last : T = null;
		var gotLast = false;
		while (i.MoveNext()) {
			if (p === null || p(i.GetCurrent())) {
				last = i.GetCurrent();
				gotLast = true;
			}
		}
		if (gotLast) return last;
		throw new Exception("Not found");
	}

	static First<T>(e: IEnumerable<T>): T
	static First<T>(e: IEnumerable<T>, p: (a: T)=>boolean): T
	static First<T>(e: any, p: (a: T)=>boolean = null): T
	{
		var i = e.GetEnumerator();
		while (i.MoveNext()) {
			if (p === null || p(i.GetCurrent()))
				return i.GetCurrent();
		}
		throw new Exception("Not found");
	}

	static Any<T>(e: IEnumerable<T>, p: (a: T)=>boolean): boolean
	{
		var i = e.GetEnumerator();
		while (i.MoveNext()) {
			if (p(i.GetCurrent()))
				return true;
		}
		return false;
	}

	static All<T>(e: IEnumerable<T>, p: (a: T)=>boolean): boolean
	{
		var i = e.GetEnumerator();
		while (i.MoveNext()) {
			if (!p(i.GetCurrent()))
				return false;
		}
		return true;
	}

	static Count<T>(e: IEnumerable<T>): number
	{
		throw new NotImplementedException ();
	}

	static Sum<T>(e: IEnumerable<T>, s: (a: T)=>number): number
	{
		throw new NotImplementedException ();
	}

	static Max<T>(e: IEnumerable<T>): number
	static Max<T>(e: IEnumerable<T>, s: (a: T)=>number): number
	static Max<T>(e: IEnumerable<T>, s?: (a: T)=>number): number
	{
		throw new NotImplementedException ();
	}

	static Min<T>(e: IEnumerable<T>): number
	static Min<T>(e: IEnumerable<T>, s: (a: T)=>number): number
	static Min<T>(e: IEnumerable<T>, s?: (a: T)=>number): number
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
		console.log(text);
	}
}

class Thread extends NObject
{
	private static nextId: number = 1;
	private static currentThread: Thread = new Thread();
	private managedThreadId: number;
	static GetCurrentThread(): Thread
	{
		return Thread.currentThread;
	};
	// not sure, setter shouldn't be here, but implementation as a whole is far from c# version.
	// in any case, Thread most likely won't be used in js code
	static SetCurrentThread(thread: Thread)
	{
		Thread.currentThread = thread;
	}

	GetManagedThreadId(): number{
		return this.managedThreadId;
	}
	constructor()
	{
		super();
		this.managedThreadId = Thread.nextId++;
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

