using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.RequestHelpers
{
    //DERIVE FROM PAGINATION PARAMS SO IT HAS BOTH PRODUCT AND PAGINATION PARAMS
    public class ProductParams : PaginationParams
    {
        
        public string OrderBy { get; set; }

        public string SearchTerm { get; set; }

        public string Types { get; set; }

        public string Brand { get; set; }

    }
}