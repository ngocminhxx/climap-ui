import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import * as exif from 'exif-js';
import { DomSanitizer } from '@angular/platform-browser';

class Photo {
  data: any;
}

/*
  Generated class for the PhotoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PhotoProvider {
  public photos: Photo[] = [];
  public currentImage: any;
  public metaData: any;

  constructor(private camera: Camera, private transfer: FileTransfer, public _DomSanitizationService: DomSanitizer) {
  }

  takePic() {
    debugger;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.photos.unshift({
        data: imageData
      });
    }, (err) => {
      // Handle error
      console.log("Camera issue:" + err);
    });
  }

  async loaded(e) {
    this.metaData = await this.getGpsData(e.target);
  }

  getGpsData(image): Promise<any> {
    return new Promise((resolve, reject) => {
      exif.getData(image, function () {
        var allMetaData = exif.getAllTags(this);
        console.log(allMetaData);
        resolve(allMetaData);
      });
    });
  }

  uploadImage() {
    debugger;
    var imgs = [];
    imgs = this.photos;

    // Destination URL
    var url = encodeURI("http://192.168.119.134:9999/api/img");

    // // File for Upload
    var targetPath = imgs[0];

    // // File name only
    var originName = imgs[0].data.replace(/^.*[\\\/]/, '');
    originName = originName.split(".")[1];
    originName = originName.split("?")[0];
    var filename = new Date().getTime().toString() + "." + originName;

    const fileTransfer: FileTransferObject = this.transfer.create();
    // alert("filename: " + filename);
    // alert("targetPath: " + targetPath);

    var options = {
      fileKey: 'img',
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      headers: {
        // 'Authorization': window.localStorage.getItem("candy")
      },
      params: {
        'fileName': filename,
        // 'jobid': this.jobId,
        'userid': "boss",
        'tag': "test tag",
        'dsc': "test dsc"
      },
    }

    fileTransfer.upload(targetPath.data, url, options)
      .then((data) => {
        // success

        alert('Image uploaded.');
        //     console.log("SUCCESS: " + JSON.stringify(result.response));
        console.log("upload success: ", data);
      }, (err) => {
        // error
        alert("upload err in then: " + err.body);
      }).catch((err) => {
        alert("upload err in catch: " + err.body);
      });
  };
}