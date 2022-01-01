using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinancialForecast.MVC.Models
{
    public class Period
    {
        public int ID { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public Double StartAmount { get; set; }

        public Double FinalAmount { get; set; }

        [ForeignKey("User")]
        public int UserRefID { get; set; }
    }
}
