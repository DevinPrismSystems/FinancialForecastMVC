using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace FinancialForecast.MVC.Models
{
    public class LoginViewModel : IdentityUser
    {
        [Required]
        [Display(Name = "Username")]
        public String Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        public LoginViewModel() { }
    }
}
