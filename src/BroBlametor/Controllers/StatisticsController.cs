using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BroBlametor.Controllers
{
    [Route("api/statistics")]
    public class StatisticsController : Controller
    {
        private static readonly Dictionary<string, int> GradeNumberMap = new Dictionary<string, int>
        {
            { "3", 0 },
            { "4", 1 },
            { "4+", 2 },
            { "5", 3 },
            { "5+", 4 },
            { "6a", 5 },
            { "6a+", 6 },
            { "6b", 7 },
            { "6b+", 8 },
            { "6c", 9 },
            { "6c+", 10 },
            { "7a", 11 },
            { "7a+", 12 },
            { "7b", 13 },
            { "7b+", 14 },
            { "7c", 15 },
            { "7c+", 16 },
            { "8a", 17 },
        };

        private static readonly Dictionary<int, string> GradeNumberReverseMap = GradeNumberMap.ToDictionary(k => k.Value, v => v.Key);

        private static readonly Dictionary<string, int> GradeScoreMap = new Dictionary<string, int>
        {
            { "3", 150 },
            { "4", 200 },
            { "4+", 250 },
            { "5", 300 },
            { "5+", 350 },
            { "6a", 400 },
            { "6a+", 450 },
            { "6b", 500 },
            { "6b+", 550 },
            { "6c", 600 },
            { "6c+", 650 },
            { "7a", 700 },
            { "7a+", 750 },
            { "7b", 800 },
            { "7b+", 850 },
            { "7c", 900 },
            { "7c+", 950 },
            { "8a", 1000 },
        };

        [HttpPost("process")]
        public async Task<ActionResult<StatisticsModel>> ProcessCsvFile(List<IFormFile> filepond)
        {
            if (filepond.Count != 1 || filepond[0].Length == 0)
            {
                return BadRequest();
            }

            var file = filepond.First();

            using (Stream stream = file.OpenReadStream())
            using (TextReader textReader = new StreamReader(stream))
            {
                List<CsvRow> rows = await ImportAsync(textReader);

                return new StatisticsModel
                {
                    Ticks = rows.Select(r => new Tick(r)).ToList(),
                    Grades = GradeScoreMap.Keys.ToList()
                };
            }
        }

        private async Task<List<CsvRow>> ImportAsync(TextReader textReader)
        {
            await textReader.ReadLineAsync(); // skip headers, those are incorrect
            // Real headers: problem_id;timestamp;grade_opinion;tries;a_like;a_love;gym_id;problem_name;author;wall_name;grade

            CsvReader reader = new CsvReader(textReader);
            reader.Configuration.Delimiter = ";";
            reader.Configuration.Quote = '"';
            reader.Configuration.BadDataFound = (ctx) => throw new Exception(ctx.Field + ":" + ctx.RawRecord);
            reader.Configuration.CultureInfo = new CultureInfo("fi");
            reader.Configuration.RegisterClassMap<CsvRowMap>();

            return reader.GetRecords<CsvRow>().ToList();
        }

        public class StatisticsModel
        {
            public List<Tick> Ticks { get; set; }
            public List<string> Grades { get; set; }
        }

        public class Tick
        {
            public Tick(CsvRow row)
            {
                ProblemId = row.ProblemId;
                ProblemName = row.ProblemName;
                GymId = row.GymId;
                Timestamp = row.Timestamp;
                WallName = HttpUtility.HtmlDecode(row.WallName);
                Score = GradeScoreMap[row.GradeName];
                Grade = new Grade
                {
                    Id = GradeNumberMap[row.GradeName],
                    Name = row.GradeName,
                };
                GradeOpinion = row.GradeOpinion.HasValue
                    ? new Grade
                    {
                        Id = row.GradeOpinion.Value,
                        Name = GradeNumberReverseMap[row.GradeOpinion.Value]
                    }
                    : null;
            }

            public int ProblemId { get; set; }
            public string ProblemName { get; set; }
            public int GymId { get; set; }
            public string WallName { get; set; }
            public DateTime Timestamp { get; set; }
            public Grade Grade { get; set; }
            public Grade GradeOpinion { get; set; }
            public int Score { get; set; }
        }

        public class Grade
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }

        public class CsvRow
        {
            public int ProblemId { get; set; }
            public DateTime Timestamp { get; set; }
            public int? GradeOpinion { get; set; }
            public int Tries { get; set; }
            public int Like { get; set; }
            public int Love { get; set; }
            public int GymId { get; set; }
            public string ProblemName { get; set; }
            public string Author { get; set; }
            public string WallName { get; set; }
            public string GradeName { get; set; }
        }

        public sealed class CsvRowMap : ClassMap<CsvRow>
        {
            public CsvRowMap()
            {
                Map(m => m.ProblemId).Index(0);
                Map(m => m.Timestamp).Index(1);
                Map(m => m.GradeOpinion).Index(2);
                Map(m => m.Tries).Index(3).Default(1);
                Map(m => m.Like).Index(4).Default(0);
                Map(m => m.Love).Index(5).Default(0);
                Map(m => m.GymId).Index(6);
                Map(m => m.ProblemName).Index(7);
                Map(m => m.Author).Index(8);
                Map(m => m.WallName).Index(9);
                Map(m => m.GradeName).Index(10);
                //Map(m => m.WortStrength).Name("Kantavierrep-%").ConvertUsing(ConvertWortStrength);
            }

            //private decimal? ConvertWortStrength(IReaderRow row)
            //{
            //    string value = row.GetField("Kantavierrep-%") ?? "";

            //    if (decimal.TryParse(value.Replace(",", "."), out decimal result))
            //    {
            //        return result;
            //    }
            //    return null;
            //}
        }
    }
}
