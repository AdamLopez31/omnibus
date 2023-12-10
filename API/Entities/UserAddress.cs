using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class UserAddress : Address
    {
        //WANT RELATIONSHIP BETWEEN USER AND USER ADDRESS
        public int Id { get; set; }
    }
}