using FinancialForecast.MVC.Models;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Data.Entity;
using Microsoft.EntityFrameworkCore.Storage;
using FinancialForecast.MVC.Data;

namespace FinancialForecast.MVC.API
{
    public class DepositsController : FinancialForecastController
    {
        [HttpGet]
        [Route("api/deposits/all")]
        public IEnumerable<Deposit> GetAllAssociatedDeposits()
        {
            return this.db.Deposits.Select(u => new Deposit(u)).ToArray();
        }

        [HttpPost]

        [Route("api/deposits/new")]
        public Int32 CreateNewDeposit([FromBody] Deposit userDeposit)
        {           
            IDbContextTransaction trans = this.db.Database.BeginTransaction();
            try
            {
                userDeposit.ID = null;
                userDeposit.UserRefID = CurrentUserID;
                userDeposit.Active = true;
                List<Deposit> deposits = new List<Deposit>();
                if (userDeposit.isRecurring)
                {
                    do
                    {
                        deposits.Add(userDeposit);
                        userDeposit = new Deposit(userDeposit);
                        userDeposit.Date = userDeposit.Date.AddDays(userDeposit.Frequency);
                    }
                    while (userDeposit.Date < userDeposit.StopDate);
                }
                this.db.Deposits.AddRange(deposits);
                this.db.SaveChanges();                
                trans.Commit();
                return Convert.ToInt32(userDeposit.ID);
                
            }
            catch
            {
                trans.Rollback();
                return 0;
            }
        }

        [HttpPost]
        [Route("api/deposits/edit/{depositID:int}")]
        public Int32 EditDeposit(Int32 depositID,[FromBody] Deposit editedDeposit)
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

        [HttpGet]
        [Route("api/deposits/getRecurringDeposits")]
        public IEnumerable<Deposit> GetRecurringDeposit([FromBody] Deposit editedDeposit)
        {

            var recurringDeposits = this.db.Deposits.Where(x => x.Description == editedDeposit.Description && x.isRecurring == true && x.Date >= editedDeposit.Date 
            && x.Date <= x.StopDate).ToArray();
            return recurringDeposits;
        }

        [HttpPost]
        [Route("api/deposits/editRecurringDeposits")]
        public void EditRecurringDeposit([FromBody] Deposit editedDeposit)
        {
            var recurringDeposits = this.db.Deposits.Where(x => x.Description == editedDeposit.Description && x.isRecurring == true && x.Date >= editedDeposit.Date
            && x.Date <= x.StopDate).ToArray();
            this.db.Deposits.RemoveRange(recurringDeposits);
            CreateNewDeposit(editedDeposit);

        }

        [HttpPost]
        [Route("api/deposits/delete/{depositID:int}")]
        public void deleteDeposit(Int32 depositID)
        {
            this.db.Deposits.Remove(db.Deposits.Where(x => x.ID == depositID).First());
            this.db.SaveChanges();
        }

        [HttpPost]
        [Route("api/deposits/deleteRecurringDeposit")]
        public void deleteRecurringDeposit([FromBody] Deposit toBeDeleted)
        {
            var recurringDeposits = this.db.Deposits.Where(x => x.Description == toBeDeleted.Description && x.isRecurring == true && x.Date >= toBeDeleted.Date
            && x.Date <= toBeDeleted.StopDate).ToArray();
            this.db.Deposits.RemoveRange(recurringDeposits);
            this.db.SaveChanges();
        }

    }
}
