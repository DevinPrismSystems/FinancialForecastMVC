﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinancialForecast.MVC.Models
{
    public class Withdrawal
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public string Description { get; set; }
        public double Amount { get; set; }
        public DateTime Date { get; set; }

        public bool Active { get; set; }

        public bool isRecurring { get; set; }

        public DateTime StopDate { get; set; }

        public int Frequency { get; set; }

        [ForeignKey("AspNetUsers")]
        public String UserRefID { get; set; }
    }
}
