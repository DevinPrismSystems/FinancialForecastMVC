using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinancialForecast.MVC.Models
{
    public class User
    {
        public Int32 UserID { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }


        public User(Int32 UserID, string FirstName, string LastName, string UserName, string Password){
            UserID = UserID;
            this.FirstName = FirstName;
            this.LastName = LastName;  
            this.UserName = UserName;
            this.Password = Password;
        }

        public User() { }
    }
}
