import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DValidateRules, FormLayout, IFileOptions, IUploadOptions} from 'ng-devui';
import {ReleaseService} from "../../../../@core/services/flink/release.service";
import {FlinkReleaseUploadParam} from "../../../../@core/data/flink.data";
import {Dict, DICT_TYPE} from "../../../../@core/data/app.data";
import {SysDictDataService} from "../../../../@core/services/admin/dict-data.service";

@Component({
  selector: 'app-release-upload',
  templateUrl: './release-upload.component.html',
  styleUrls: ['../release.component.scss'],
})
export class ReleaseUploadComponent implements OnInit {
  parent: HTMLElement;
  @Input() data: any;
  formLayout = FormLayout.Horizontal;
  formConfig: { [Key: string]: DValidateRules } = {
    rule: {message: this.translate.instant('app.error.formValidateError'), messageShowType: 'text'},
    versionRules: {
      validators: [
        {required: true},
        {maxlength: 30}
      ],
    },
    fileRules: {
      validators: [{required: true}],
    },
    remarkRules: {
      validators: [{maxlength: 200}],
    },
  };
  flinkVersionList: Dict[] = []
  fileOptions: IFileOptions = {
    multiple: false,
  };
  uploadedFiles: Array<Object> = [];
  uploadOptions: IUploadOptions = {
    uri: '',
  };
  successFlag = false;
  file = null;

  formData = {
    version: null,
    file: null,
    remark: null,
  };

  constructor(private elr: ElementRef, private translate: TranslateService, private dictDataService: SysDictDataService, private releaseService: ReleaseService) {
  }

  ngOnInit(): void {
    this.parent = this.elr.nativeElement.parentElement;
    this.dictDataService.listByType(DICT_TYPE.flinkVersion).subscribe((d) => {
      this.flinkVersionList = d;
    });
  }

  submitForm({valid}) {
    let uploadParam: FlinkReleaseUploadParam = {
      version: this.formData.version ? this.formData.version.value : '',
      file: this.file,
      remark: this.formData.remark,
    };
    if (valid && this.file) {
      this.releaseService.upload(uploadParam).subscribe((d) => {
        if (d.success) {
          this.data.onClose();
          this.data.refresh();
        }
      });
    }
  }

  deleteUploadedFile(file) {
    this.file = null
  }

  onFileSelect(result) {
    this.file = result
  }

  close(event) {
    this.data.onClose(event);
  }
}
