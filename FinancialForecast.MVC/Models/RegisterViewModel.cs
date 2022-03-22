using System;
using System.ComponentModel.DataAnnotations;

namespace FinancialForecast.MVC.Models
{
    public class RegisterViewModel
    {
        [Required]
        [Display(Name = "Username")]
        public String Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "ConfirmPassword")]
        public string ConfirmPassword { get; set; }

        public RegisterViewModel() { }
    }

}
