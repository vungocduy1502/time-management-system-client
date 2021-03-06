<template>
  <section-block title="Monthly Report">
    <div>
      <section class="group-filter">
        <div v-if="$authInfo.role() !== 4" class="gr-search">
          <el-select v-model="groupSearch" class="table" placeholder="Group" :disabled="$authInfo.role() == 3">
            <el-option
              v-for="(item, index) in groups"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            v-model="fullnameSearch"
            placeholder="Account"
            class="input-search"
            clearable
          />
        </div>
        <div class="el-searchDate">
          <el-date-picker
            v-model="dateMonthlyDate"
            type="date"
            placeholder="Monthly Report"
            format="dd-MM-yyyy"
            value-format="yyyy-MM-dd"
            class="date-picker"
          />

          <el-button
            class="button-delete-multi"
            type="primary"
            @click="searchMonthlyReport()"
          >
            <i class="el-icon-search"></i>
          </el-button>

          <el-button
            class="button-delete-multi"
            type="primary"
            @click="getListMonthly(page, size)"
          >
            <i class="el-icon-refresh"></i>
          </el-button>
        </div>
      </section>

      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        style="width: 100%"
        class="table-serenade"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          class-name="text-left"
          prop="account"
          sortable
          :label="$t('Account')"
        />
        <el-table-column
          class-name="text-left"
          prop="group_name"
          :label="$t('Group')"
        />
        <el-table-column
          class-name="text-center"
          prop="total_work_day"
          :label="$t('Total Work Day')"
        />
        <el-table-column
          class-name="text-center"
          prop="paidLeave"
          :label="$t('Paid Leave')"
        />
        <el-table-column
          class-name="text-center"
          prop="nonPaidLeave"
          :label="$t('Non Paid Leave')"
        />

        <el-table-column
          class-name="text-center"
          prop="action"
          :label="$t('Action')"
          width="110px"
        >
          <template slot-scope="scope">
            <el-button
              class="button-action"
              type="primary"
              @click="handleInfo(scope.$index, scope.row)"
            >
              <i class="el-icon-user"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <section>
        <el-dialog
          :title="titlePopup"
          :visible.sync="dialogFormWithInput"
          width="50%"
        >
          <div v-if="dialogMode === 'detail'">
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Account</label>
              <div class="col-sm-8 data-detail">
                {{ Monthly.account }}
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Group</label>
              <div class="col-sm-8 data-detail">
                {{ Monthly.group_name }}
              </div>
            </div>

            <el-table
              :data="request.list"
              style="
                width: 60%;
                margin: 20px 0 20px 65px;
                border: 1px solid #e2e8f0;
              "
            >
              <el-table-column label="Paid Leave" width="200">
                <template slot-scope="{ row }">
                  <i v-if="row.paidLeave" class="el-icon-time"></i>
                  <span style="margin-left: 10px">
                    {{ row.paidLeave }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="Non Paid Leave" width="200">
                <template slot-scope="{ row }">
                  <i v-if="row.nonPaidLeave" class="el-icon-time"></i>
                  <span style="margin-left: 10px">
                    {{ row.nonPaidLeave }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <hr class="mb-0" />
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormWithInput = false">Close</el-button>
            <el-button
              v-if="dialogMode !== 'detail'"
              type="primary"
              @click="dialogMode === 'create' ? createData() : updateData()"
            >
              Submit
            </el-button>
          </span>
        </el-dialog>
      </section>

      <div class="d-flex pagination">
        <SimplePagination
          v-if="!isEmpty(tableData) && totalPages > 1"
          v-model="page"
          :change-page="changePageData"
          :total-page="totalPages"
        />
      </div>
    </div>
  </section-block>
</template>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.data-detail {
  line-height: 35px;
}
.content {
  margin: 70px 32px 20px;
  .title {
    margin: 30px 0 40px;
  }
}
.table {
  width: 150px;
}
.tabel-wrapper {
  width: 1200px;
  margin: 50px auto;
}
.el-table tr th {
  background-color: #f5f7fa;
}

.demo-input-label {
  display: inline-block;
  width: 45px;
  text-align: center;
}
.searchCombox {
  width: 150px;
}
.demo-input-suffix .el-input {
  width: 80px;
}

.el-form-item__label {
  text-align: left;
}

.line {
  margin-top: -30px;
}
label {
  text-align: center;
}
.group-filter {
  margin-bottom: 20px;
  display: flex;
  .gr-button {
    float: right;
    margin-bottom: 15px;
  }
  .gr-search {
    margin-right: 3px;
  }
  .gr-searchDate {
    margin-left: 3px;
  }
}
.button-action {
  padding: 5px;
  margin-left: 0;
}
.pagination {
  margin-top: 30px;
}
.input-search {
  width: 150px;
}
</style>

<script>
import SimplePagination from '~/components/pagination/SimplePagination'
import validate from '@/helpers/custom-rules-validate'

export default {
  components: { SimplePagination },
  mixins: [validate],
  layout: 'admin',
  middleware: 'auth',
  data() {
    return {
      tableData: [],
      fullnameSearch: '',
      groupSearch: '',
      startDate: '',
      dateMonthlyDate: '',
      dateMonthlyReport: '',
      dialogFormWithInput: false,
      showFormMessage: false,
      dataReject: {},
      titlePopup: '',
      dialogMode: '',
      // account: '',
      groups: [],
      projects: [],
      message: {
        response_msg: '',
      },

      user: {
        account: '',
        group: '',
        project: '',
      },
      totalTimeOt: '',
      request: {
        account: this.$authInfo.name(),
        title: '',
        reason: '',
        groupCompany: '',
        late_time: '',
        soon_time: '',
        start_date: '',
        end_date: '',
        cc_mail_ids: '',
        content: '',
        response_msg: '',
        status: '',
        radio: 1,
        list: [],
      },
      rules: {
        title: this.validateRequired('title'),
        groupCompany: this.validateRequired('groupCompany'),
        late_time: this.validateRequired('late_time'),
        soon_time: this.validateRequired('soon_time'),
        start_date: this.validateRequired('start_date'),
        end_date: this.validateRequired('end_date'),
        account_receiver: this.validateRequired('account_receiver'),
      },
      rowSelected: null,
      multipleSelection: [],
      totalPages: 1,
      page: 1,
      size: undefined,
      monthly: {},
    }
  },
  created() {
    const query = this.$route.query
    if (query.page) {
      this.page = query.page
    }
    if (query.size) {
      this.size = query.size
    }
    this.getListMonthly(this.page, this.size)
    this.getUserInfo()
    this.getListGroupMonthly()
  },
  methods: {
    // async refreshSearch() {
    //   this.startLoading()
    //   this.fullnameSearch = ""
    //   this.startDate = ""
    //   this.endDate = ""
    //   this.groupSearch = ""
    //   this.getListMonthly(0, 20)
    //   setTimeout(()=> {
    //     this.endLoading()
    //   }, 300)
    // },
    async getListMonthly(page, size) {
      this.startLoading()
      let params = {
        page: page - 1,
        size: size,
      }
      if (this.$authInfo.roleValue() === 'staff') {
        await this.$services.monthly.getListMonthly(
          params,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.tableData = response.data
              this.totalPages = response.totalPages
            }
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
      } else {
        await this.$services.monthly.getListMonthly(
          params,
          (response) => {
            if (response.data && response.data.length > 0) {
              this.tableData = response.data
              this.totalPages = response.totalPages
            }
          },
          (err) => {
            this.notifyError(err.error.error)
          }
        )
      }
      setTimeout(() => {
        this.endLoading()
      }, 300)
    },
    async getListGroupMonthly() {
      await this.$services.monthly.getListGroupMonthly(
        (response) => {
          if (response.listData && response.listData.length > 0) {
            this.groups = response.listData.map((item) => {
              return { label: item.name, value: Number(item.group_id) }
            })
          }
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    async getUserInfo() {
      await this.$services.common.getUserInfo(
        (response) => {
          this.user = response.data
          console.log(response.data)
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    async getListUser() {
      await this.$services.user.getListUser(
        {},
        (response) => {
          if (response.data && response.data.length > 0) {
            this.account = response.data.map((item) => {
              return { label: item.username, value: item.username }
            })
          }
        },
        (err) => this.notifyError(err.error.error)
      )
    },
    async searchMonthlyReport() {
      this.startLoading()
      let filterObj = {}
      console.log(this.groupSearch)
      if (!this.fullnameSearch.length == 0 || this.fullnameSearch.trim()) {
        filterObj.userName = this.fullnameSearch.trim()
      }
      if (this.groupSearch !== '') {
        filterObj.groupId = this.groupSearch
      }
      if (
        this.dateMonthlyDate &&
        (!this.dateMonthlyDate.length == 0 || this.dateMonthlyDate.trim())
      ) {
        filterObj.dateMonthlyReport = this.dateMonthlyDate
      }

      await this.$services.monthly.searchMonthlyReport(
        filterObj,
        (response) => {
          if (response.data && response.data.length > 0) {
            this.tableData = response.data
            this.totalPages = response.totalPages
          } else {
            this.tableData = []
            this.totalPages = 0
          }
        },
        (err) => {
          this.tableData = []
          this.totalPages = 0
          this.endLoading()
          this.notifyError(err.error.error)
        }
      )
      this.endLoading()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    changePageData(page) {
      this.getListMonthly(page, this.size)
      this.page = page
      const roleValue = this.$authInfo.roleValue()
      this.$router.push({
        name: `${roleValue}-report-abnormal`,
        query: { page, size: this.size },
      })
    },
    resetUserData() {
      this.request = {
        account: this.$authInfo.username(),
        title: '',
        reason: '',
        groupCompany: '',
        late_time: '',
        start_date: '',
        end_date: '',
        cc_mail_ids: '',
        content: '',
        response_msg: '',
        status: '',
        radio: 1,
      }
    },

    async getListMonthly(page, size) {
      let params = {
        page: page - 1,
        size: size,
      }
      await this.$services.monthly.getListMonthly(
        params,
        (response) => {
          if (response.data && response.data.length > 0) {
            this.tableData = response.data
            this.totalPages = response.totalPages
          }
        },
        (err) => {
          this.notifyError(err.error.error)
        }
      )
    },

    getListMonthlyDetail(dataRequest) {
      this.startLoading()
      this.$services.monthly.getListMonthlyDetail(
        dataRequest,
        (res) => {
          this.request.list = []
          let length = res.listPaidLeaveDay.length
          if (res.listNonPaidLeaveDay.length >= res.listPaidLeaveDay.length) {
            length = res.listNonPaidLeaveDay.length
          }
          for (let i = 0; i < length; i++) {
            let element = {
              nonPaidLeave: null,
              paidLeave: null,
            }
            if (res.listNonPaidLeaveDay[i]) {
              element.nonPaidLeave = res.listNonPaidLeaveDay[i]
            }
            if (res.listPaidLeaveDay[i]) {
              element.paidLeave = res.listPaidLeaveDay[i]
            }
            this.request.list.push(element)
          }
          console.log(length)
          console.log('res', this.request.list)
          this.dialogFormWithInput = true
          this.endLoading()
        },
        (err) => {
          this.endLoading()
          this.notifyError(err.error.error)
        }
      )
    },
    handleInfo(index, row) {
      this.titlePopup = 'Detail'
      this.dialogMode = 'detail'
      const temp = Object.assign({}, row)
      const dataRequest = {
        accountId: temp.account_id,
        dateMonthlyReport: temp.monthly || null,
      }
      this.Monthly = Object.assign({}, row)
      console.log(index)
      console.log(row)
      console.log(temp)
      console.log(dataRequest)
      this.getListMonthlyDetail(dataRequest)
    },
  },
}
</script>
