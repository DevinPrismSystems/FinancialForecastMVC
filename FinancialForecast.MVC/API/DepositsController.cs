using FinancialForecast.MVC.Models;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;

namespace FinancialForecast.MVC.API
{
    public class DepositsController : ForecastAPIController
    {
        [HttpGet]
        [Route("api/deposits/all")]
        public IEnumerable<Deposit> Get()
        {
            return this.db.Deposits.Select(u => new Deposit(u)).ToArray();
        }

        [HttpPost]

        [Route("api/deposits/new")]
        public Int32 Post([FromBody] Deposit newdeposit)
        {
            this.db.Deposits.Add(newdeposit);
            this.db.SaveChanges();
            return Convert.ToInt32(newdeposit.ID);
        }

        [HttpPost]
        [Route("api/deposits/edit/{depositID:int}")]
        public Int32 Post(Int32 depositID,[FromBody] Deposit editedDeposit)
        {
            Deposit original = this.db.Deposits.Where(x => x.ID == depositID).FirstOrDefault();
            original.Description = editedDeposit.Description;
            original.StopDate = editedDeposit.StopDate;
            original.Frequency = editedDeposit.Frequency;
            original.Amount = editedDeposit.Amount;
            original.isRecurring = editedDeposit.isRecurring;
            original.UserRefID = editedDeposit.UserRefID;

            this.db.SaveChanges();
            return Convert.ToInt32(original.ID);
        }
    }
}
