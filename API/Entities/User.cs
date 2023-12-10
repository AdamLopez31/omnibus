using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    //DEFAULT OF ID OF IDENTITY USER IS STRING
    public class User : IdentityUser<int>
    {
        //RELATIONSHIP 1 USER -> 1 USERADDRESS
        //IF USER DELETES ACCOUNT WE WANT IT TO CASCADE DOWN TO TABLE THAT STORE USER ADDRESS
        public UserAddress Address { get; set; }
    }
}