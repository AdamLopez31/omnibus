using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    //GENERIC TYPE PARAMETER <T> WE CAN USE THIS CLASS WITH ANY OUR OUR ENTITIES
    public class PagedList<T> : List<T>
    {
        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            MetaData = new MetaData
            {
                TotalCount = count,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                //(int) (double) CASTING .Ceiling() ROUND UP DECIMAL NUMBERS
                TotalPages = (int)Math.Ceiling(count / (double)pageSize)
            };
            AddRange(items);
        }

        //OUR PAGED LIST WILL HAVE ALL THE PROPERTIES OF A LIST BUT ALSO ADD A PROPERTY OF METADATA
        public MetaData MetaData { get; set; }

        public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize) {

            //with await query is executed agianst the database
            var count = await query.CountAsync();
            var items = await query.Skip((pageNumber-1)*pageSize).Take(pageSize).ToListAsync();
            return new PagedList<T>(items,count,pageNumber,pageSize);
        }

    }
}