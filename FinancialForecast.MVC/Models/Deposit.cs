using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FinancialForecast.MVC.Models
{
    public class Deposit
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Nullable<int> ID { get; set; }

        [JsonPropertyName("Description")]
        public string Description { get; set; }

        [JsonPropertyName("Active")]
        public bool Active { get; set; }

        [JsonPropertyName("Date")]
        public DateTime Date { get; set; }

        [JsonPropertyName("Amount")]
        public double Amount { get; set; }


        [JsonPropertyName("Recurring")]
        public bool isRecurring { get; set; }

        [JsonPropertyName("Stop Date")]       
        public DateTime StopDate { get; set; }

        [JsonPropertyName("Frequency")]
        public int Frequency { get; set; }

        [ForeignKey("AspNetUsers")]
        [JsonPropertyName("UserID")]
        public String UserRefID { get; set; }

        public Deposit() {
            this.Active = true;
            this.Date = DateTime.Now;
        }

        public Deposit(int iD, string description, double amount, DateTime date, bool active, bool isRecurring, DateTime stopDate, int frequency, string userRefID)
        {
            this.ID = iD;
            this.Description = description;
            this.Amount = amount;
            this.Date = date;
            this.Active = active;
            this.isRecurring = isRecurring;
            this.StopDate = stopDate;
            this.Frequency = frequency;
            this.UserRefID = userRefID;
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
            this.isRecurring = deposit.isRecurring;
        }

        public class DateTimeConverter : JsonConverter<DateTime>
        {
            public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            {
                Debug.Assert(typeToConvert == typeof(DateTime));
                return DateTime.Parse(reader.GetString());
            }

            public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
            {
                //writer.WriteStringValue(value.ToUniversalTime().ToString("MM/dd/yyyy"));
                writer.WriteStringValue(value.ToUniversalTime().ToString("yyyy-MM-dd"));
            }
        }

    }


}
