using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinancialForecast.MVC.Models
{
    public class Deposit
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Nullable<int> ID { get; set; }


        public string Description { get; set; }
        public double Amount { get; set; }
        public DateTime Date { get; set; }

        public bool Active { get; set; }

        public bool isRecurring { get; set; }

        public DateTime StopDate { get; set; }

        public int Frequency { get; set; }

        [ForeignKey("AspNetUsers")]
        public String UserRefID { get; set; }

        public Deposit() { }

        public Deposit(int iD, string description, double amount, DateTime date, bool active, bool isRecurring, DateTime stopDate, int frequency, string userRefID)
        {
            ID = iD;
            Description = description;
            Amount = amount;
            Date = date;
            Active = active;
            this.isRecurring = isRecurring;
            StopDate = stopDate;
            Frequency = frequency;
            UserRefID = userRefID;
        }

        public Deposit(Deposit deposit)
        {
            this.ID = deposit.ID;
            this.Description = deposit.Description;  
            this.Amount = deposit.Amount;
            this.Date = deposit.Date;
            this.Active = deposit.Active;
            this.UserRefID = deposit.UserRefID;
            this.StopDate = deposit.StopDate;
            this.Frequency = deposit.Frequency;
            this.Date = deposit.Date;
        }
    }


}
