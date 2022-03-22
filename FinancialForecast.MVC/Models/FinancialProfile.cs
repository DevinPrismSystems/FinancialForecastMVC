using System;

namespace FinancialForecast.MVC.Models
{
    public class FinancialProfile
    {
        public string UserRefID { get; set; }

        public double StartAmount { get; set; }

        public DateTime DateEntered { get; set; }

        public FinancialProfile(string userID)
        {
            UserRefID = userID;
            StartAmount = 0;
            DateEntered = DateTime.Now;
        }

        public FinancialProfile() { 

        }
    }
}
