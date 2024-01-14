using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace API.Services
{
    public class ImageService
    {
        //GIVES US ACCESS TO CLOUDINARY SERVICE
        private readonly Cloudinary _cloudinary;
        //IConfiguration so we can get access to the config values
        //we added to our user secrets
        public ImageService(IConfiguration config)
        {
            //ACCOUNT COMES FROM CLOUDINARY
            var account = new Account(
                config["Cloudinary:Cloudname"],
                config["Cloudinary:ApiKey"],
                config["Cloudinary:ApiSecret"]
            );

            _cloudinary = new Cloudinary(account);
        }

        public async Task<ImageUploadResult> AddImageAsync(IFormFile file) {
            var uploadResult = new ImageUploadResult();

            if(file.Length > 0) {
                //STORE THE CONTENTS OF THE FILE IN MEMORY
                using var stream = file.OpenReadStream();

                var uploadParams = new ImageUploadParams {
                    File = new FileDescription(file.FileName, stream)
                };
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }

            return uploadResult;
        }

        //DELETE IMAGE
        //CLOUDINARY GENERATES PUBLIC ID
        public async Task<DeletionResult> DeleteImageAsync(string publicId) {
            var deleteParams = new DeletionParams(publicId);

            var result = await _cloudinary.DestroyAsync(deleteParams);

            return result;
        }
    }
}