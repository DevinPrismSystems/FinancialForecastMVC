using FinancialForecast.MVC.Models;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;

namespace FinancialForecast.MVC.API
{
    public class UsersController : FinancialForecastController
    {
        [HttpGet]
        [Route("api/users/all")]
        public IEnumerable<User> Get()
        {
            return this.db.Users.Select(u => new User(u)).ToArray();
        }

        [HttpPost]

        [Route("api/users/new")]
        public Int32 Post([FromBody] User newUser)
        {
            this.db.Users.Add(newUser);
            this.db.SaveChanges();
            return Convert.ToInt32(newUser.UserID);
        }

        [HttpPost]
        [Route("api/users/edit/{UserID:int}")]
        public Int32 Post(Int32 UserID,[FromBody] User editedUser)
        {
            User original = this.db.Users.Where(x => x.UserID == UserID).FirstOrDefault();
            original.FirstName = editedUser.FirstName;
            original.LastName = editedUser.LastName;   
            original.UserName = editedUser.UserName;
            original.Password = editedUser.Password;

            this.db.SaveChanges();
            return Convert.ToInt32(original.UserID);
        }
    }
}
