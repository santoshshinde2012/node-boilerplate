/**
 * RecordRtc Controller
 */
import * as qs from "querystring";
import * as envHandler from "../../helpers/environment.handler";
import * as formidable from "formidable";
import * as util from "util";
import * as path from "path";

export class RecordRtcController {

    private async parseForm(request: any, upload: string): Promise<any> {
        const form = new formidable.IncomingForm();
      
        form.uploadDir = upload;
        form.keepExtensions = true;
        form.maxFieldsSize = 10 * 1024 * 1024;
        form.maxFields = 1000;
        form.multiples = false;
        return new Promise((resolve, reject) => {
            form.parse(request, (err, fields, files) => {
                if (err) reject(err);
                else resolve({fields, files});
            });
        });
    }
    
    public async uploadFile(request: any): Promise<any> {
        try {
            const dir = !!process.platform.match(/^win/) ? '\\public\\uploads\\' : '/public/uploads/';
            const upload = path.join(__dirname, "../../../", dir);
            const { fields, files } = await this.parseForm(request, upload);
            const file = util.inspect(files);
            const fileName = file.split('path:')[1].split('\',')[0].split(dir)[1].toString().replace(/\\/g, '').replace(/\//g, '');
            const fileURL = 'http://localhost:3000/uploads/' + fileName;
            return fileURL;

        } catch(err) {
            throw(err)
        }
    }
}
