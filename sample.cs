using System;

class Person
{
	public string FirstName { get; set; }
	public string LastName { get; set; }
	public string FullName {
		get { return FirstName + " " + LastName; }
	}
	public DateTime DateOfBirth { get; set; }
	public int DaysOld => (int)((DateTime.Now - DateOfBirth).TotalDays + 0.5);
	public bool AYearOld => (DateTime.Now - DateOfBirth) >= TimeSpan.FromDays (365);
	public int Age {
		get {
			var now = DateTime.Now;
			var afterBirthday =
				new DateTime (DateOfBirth.Year,now.Month,now.Day) >=
				DateOfBirth;
			return (afterBirthday) ? 
				now.Year - DateOfBirth.Year : 
				now.Year - DateOfBirth.Year - 1;
		}
	}

	public Person() {
		FirstName = "";
		LastName = "";
	}
}