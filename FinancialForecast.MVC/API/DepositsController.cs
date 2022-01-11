using FinancialForecast.MVC.Models;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Data.Entity;
using Microsoft.EntityFrameworkCore.Storage;

namespace FinancialForecast.MVC.API
{
    public class DepositsController : FinancialForecastController
    {
        [HttpGet]
        [Route("api/deposits/all")]
        public IEnumerable<Deposit> Get()
        {
            return this.db.Deposits.Select(u => new Deposit(u)).ToArray();
        }

        [HttpPost]

        [Route("api/deposits/new")]
        public Int32 Post([FromBody] Deposit newDeposit)
        {
            IDbContextTransaction trans = this.db.Database.BeginTransaction();
            try
            {
                newDeposit.ID = null;
                newDeposit.UserRefID = CurrentUserID;
                newDeposit.Active = true;
                this.db.Deposits.Add(newDeposit);
                this.db.SaveChanges();
                if (newDeposit.isRecurring)
                {
                    newDeposit.Date = newDeposit.Date.AddDays(newDeposit.Frequency);
                    newDeposit.ID = null;
                    while (newDeposit.Date < newDeposit.StopDate)
                    {
                        this.db.Deposits.Add(newDeposit);
                        this.db.SaveChanges();
                        newDeposit.Date = newDeposit.Date.AddDays(newDeposit.Frequency);
                    }
                }
                
                trans.Commit();
                return Convert.ToInt32(newDeposit.ID);
                
            }
            catch
            {
                trans.Rollback();
                return 0;
            }
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
