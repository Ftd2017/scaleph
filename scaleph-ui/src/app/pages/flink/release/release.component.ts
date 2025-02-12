import {DOCUMENT} from '@angular/common';
import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DataTableComponent, LoadingService, ModalService} from 'ng-devui';
import {DEFAULT_PAGE_PARAM, Dict, DICT_TYPE, PRIVILEGE_CODE, USER_AUTH} from 'src/app/@core/data/app.data';
import {FlinkRelease, FlinkReleaseParam} from 'src/app/@core/data/flink.data';
import {AuthService} from 'src/app/@core/services/auth.service';
import {ReleaseService} from 'src/app/@core/services/flink/release.service';
import {ReleaseUploadComponent} from "./release-upload/release-upload.component";
import {ReleaseDeleteComponent} from "./release-delete/release-delete.component";
import {SysDictDataService} from "../../../@core/services/admin/dict-data.service";

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.scss'],
})
export class ReleaseComponent implements OnInit {
  PRIVILEGE_CODE = PRIVILEGE_CODE;
  @ViewChild('dataTable', {static: true}) dataTable: DataTableComponent;
  dataLoading: boolean = false;
  dataTableChecked: boolean = false;
  loadTarget: any;
  dataTableDs: FlinkRelease[] = [];
  pager = {
    total: 0,
    pageIndex: DEFAULT_PAGE_PARAM.pageIndex,
    pageSize: DEFAULT_PAGE_PARAM.pageSize,
    pageSizeOptions: DEFAULT_PAGE_PARAM.pageParams,
  };

  searchFormConfig = {version: null, fileName: ''};

  flinkVersionList: Dict[] = []

  constructor(
    public authService: AuthService,
    @Inject(DOCUMENT) private doc: any,
    private loadingService: LoadingService,
    private translate: TranslateService,
    private modalService: ModalService,
    private dictDataService: SysDictDataService,
    private releaseService: ReleaseService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.refreshTable();
    this.dictDataService.listByType(DICT_TYPE.flinkVersion).subscribe((d) => {
      this.flinkVersionList = d;
    });
  }

  refreshTable() {
    this.openDataTableLoading();
    let param: FlinkReleaseParam = {
      pageSize: this.pager.pageSize,
      current: this.pager.pageIndex,
      version: this.searchFormConfig.version ? this.searchFormConfig.version.value : '',
      fileName: this.searchFormConfig.fileName,
    };

    this.releaseService.list(param).subscribe((d) => {
      this.pager.total = d.total;
      this.dataTableDs = d.records;
      this.loadTarget.loadingInstance.close();
      this.dataLoading = false;
      this.dataTable.setTableCheckStatus({pageAllChecked: false});
      this.getDataTableCheckedStatus();
    });
  }

  openDataTableLoading() {
    const dc = this.doc.querySelector('#dataTableContent');
    this.loadTarget = this.loadingService.open({
      target: dc,
      message: this.translate.instant('app.common.loading'),
      positionType: 'relative',
      zIndex: 1,
    });
    this.dataLoading = true;
  }

  getDataTableCheckedStatus() {
    if (this.dataTable.getCheckedRows().length > 0) {
      this.dataTableChecked = true;
    } else {
      this.dataTableChecked = false;
    }
  }

  reset() {
    this.searchFormConfig = {version: null, fileName: ''};
    this.pager = {
      total: 0,
      pageIndex: DEFAULT_PAGE_PARAM.pageIndex,
      pageSize: DEFAULT_PAGE_PARAM.pageSize,
      pageSizeOptions: DEFAULT_PAGE_PARAM.pageParams,
    };
    this.refreshTable();
  }

  openUploadReleaseDialog() {
    const results = this.modalService.open({
      id: 'release-upload',
      width: '580px',
      backdropCloseable: true,
      component: ReleaseUploadComponent,
      data: {
        title: {name: this.translate.instant('flink.release.name')},
        onClose: (event: any) => {
          results.modalInstance.hide();
        },
        refresh: () => {
          this.refreshTable();
        },
      },
    });
  }

  openLoadReleaseDialog() {
    alert("work in progress")
  }

  openDeleteReleaseDialog(items: FlinkRelease[]) {
    const results = this.modalService.open({
      id: 'resource-delete',
      width: '346px',
      backdropCloseable: true,
      component: ReleaseDeleteComponent,
      data: {
        title: this.translate.instant('app.common.operate.delete.confirm.title'),
        items: items,
        onClose: (event: any) => {
          results.modalInstance.hide();
        },
        refresh: () => {
          this.refreshTable();
        },
      },
    });
  }

  downloadRelease(item: FlinkRelease) {
    let url: string =
      'api/flink/release/' + item.id +
      '?' +
      USER_AUTH.token +
      '=' +
      localStorage.getItem(USER_AUTH.token);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
