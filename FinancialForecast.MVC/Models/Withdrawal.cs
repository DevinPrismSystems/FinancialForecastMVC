using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FinancialForecast.MVC.Models
{
    public class Withdrawal
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Nullable<int> ID { get; set; }

        [JsonPropertyName("Description")]
        public string Description { get; set; }

        [JsonPropertyName("Amount")]
        public double Amount { get; set; }

        [JsonPropertyName("Date")]
        public DateTime Date { get; set; }

        [JsonPropertyName("Active")]
        public bool Active { get; set; }

        [JsonPropertyName("Recurring")]
        public bool isRecurring { get; set; }

        [JsonPropertyName("Stop Date")]
        public DateTime StopDate { get; set; }

        [JsonPropertyName("Frequency")]
        public int Frequency { get; set; }

        [ForeignKey("AspNetUsers")]
        [JsonPropertyName("UserID")]
        public String UserRefID { get; set; }

        public Withdrawal()
        {
            this.Active = true;
            this.Date = DateTime.Now;
        }

        public Withdrawal(int iD, string description, double amount, DateTime date, bool active, bool isRecurring, DateTime stopDate, int frequency, string userRefID)
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

        public Withdrawal(Withdrawal Withdrawal)
        {
            this.ID = Withdrawal.ID;
            this.Description = Withdrawal.Description;
            this.Amount = Withdrawal.Amount;
            this.Date = Withdrawal.Date;
            this.Active = Withdrawal.Active;
            this.UserRefID = Withdrawal.UserRefID;
            this.StopDate = Withdrawal.StopDate;
            this.Frequency = Withdrawal.Frequency;
            this.Date = Withdrawal.Date;
            this.isRecurring = Withdrawal.isRecurring;
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
