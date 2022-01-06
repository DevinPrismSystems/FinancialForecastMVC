using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace FinancialForecast.MVC.Models
{
    public class User
    {
        [JsonPropertyName("UserID")]
        public Int32 UserID { get; set; }

        [JsonPropertyName("First Name")]
        [Display(Name = "First Name")]
        public String FirstName { get; set; }

        [JsonPropertyName("Last Name")]
        [Display(Name = "Last Name")]
        public String LastName { get; set; }

        [JsonPropertyName("Username")]
        public String UserName { get; set; }

        [JsonPropertyName("Password")]
        public String Password { get; set; }


        public User(Int32 UserID, String FirstName, String LastName, String UserName, String Password){
            this.UserID = UserID;
            this.FirstName = FirstName;
            this.LastName = LastName;  
            this.UserName = UserName;
            this.Password = Password;
        }

        public User(User u) {
            this.UserID = u.UserID;
            this.FirstName = u.FirstName;
            this.LastName = u.LastName;
            this.UserName = u.UserName;
            this.Password = u.Password;
        }

        public User()
        {

        }
    }
}
