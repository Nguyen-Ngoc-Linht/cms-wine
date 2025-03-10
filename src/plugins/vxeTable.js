import 'xe-utils'
// import { i18n } from '@/local'
import {
  // global object
  VXETable,

  // form function
  Icon,
  Filter,
  Edit,
  Menu,
  Export,
  Keyboard,
  Validator,

  // optional components
  Column,
  Colgroup,
  Grid,
  Tooltip,
  Toolbar,
  Pager,
  Form,
  FormItem,
  FormGather,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  RadioButton,
  Switch,
  Input,
  Select,
  Optgroup,
  Option,
  Textarea,
  Button,
  Modal,
  List,
  Pulldown,

  // sheet
  Table,
} from 'vxe-table'

import 'vxe-table/lib/style.css'

// 全局默认参数
VXETable.setup({
  size: 'medium', // global size medium, small, mini
  zIndex: 999, // Global zIndex starting value. If the z-index style value of the project is too large, it needs to be set larger to avoid being blocked.
  version: 0, // Version number, useful for some functions with data caching. Increasing the version number can be used to reset data
  loadingText: 'Loading, please wait...', // Customize the loading prompt content. If it is null, no text will be displayed.
  table: {
    autoResize: true, // Automatically monitor changes in parent elements to recalculate the table
    border: false,

    emptyText: 'No data yet',

    keepSource: false, // Keep the state of the original value, which is relied on by certain functions, such as editing status, restoring data, etc. (it will affect performance after turning it on, depending on the amount of data)）

    round: false,

    showFooter: false,
    showFooterOverflow: true,

    showHeader: true,
    showHeaderOverflow: true,

    showOverflow: true, // Set all content to be displayed as ellipses when it is too long (if it is a fixed column, it is recommended to set this value to improve rendering speed）
    stripe: false,
    // size : 'medium', // medium, small, mini

    rowConfig: {
      useKey: false,
      isCurrent: true, // Whether to highlight the current row when the mouse clicks on it
      isHover: true, // Whether to highlight the current line when the mouse moves to the line
      keyField: '_X_ROW_KEY', // The unique primary key field name of the row data
    },

    radioConfig: {
      strict: true,
      reserve: false,
      trigger: 'default',
    },
    checkboxConfig: {
      strict: true,
      highlight: true,
      range: false,
      trigger: 'default',
    },

    sortConfig: {
      remote: false,
      trigger: 'default',
      orders: ['asc', 'desc', null],
      sortMethod: null,
    },
    filterConfig: {
      remote: false,
      filterMethod: null,
    },
    expandConfig: {
      trigger: 'default',
      showIcon: true,
    },
    treeConfig: {
      rowField: 'id',
      parentField: 'parentId',
      children: 'children',
      hasChild: 'hasChild',
      mapChildren: '_X_ROW_CHILD',
      indent: 20,
      showIcon: true,
    },
    tooltipConfig: {
      enterable: true,
    },
    menuConfig: {
      className: 'vt-menus',
      // The return value of this function is used to determine whether to allow the right-click menu to be displayed (it may be used when permission control of the menu is required)）
      visibleMethod() {},
    },
    // Editable configuration items
    editConfig: {
      mode: 'cell',
      showAsterisk: true,
    },
    importConfig: {
      modes: ['insert', 'covering'],
    },
    exportConfig: {
      modes: ['current', 'selected'],
    },
    customConfig: {
      storage: false,
    },
    scrollX: {
      gt: 60,
    },
    scrollY: {
      gt: 100,
    },
  },
  // grid : {
  //   size : null,
  //   zoomConfig : {
  //     escRestore : true
  //   },
  //   pagerConfig : {
  //     perfect : false
  //   },
  //   toolbarConfig : {
  //     perfect : false
  //   },
  //   proxyConfig : {
  //     autoLoad : true,
  //     message : true,
  //     props : {
  // list : null, // used for list, read response data
  // result : 'result', // used for paging and reading response data
  // total : 'page.total' // Used for paging, reading the total number of items
  //     },
  //     beforeItem : null,
  //     beforeColumn : null,
  //     beforeQuery : null,
  //     afterQuery : null,
  //     beforeDelete : null,
  //     afterDelete : null,
  //     beforeSave : null,
  //     afterSave : null
  //   }
  // },
  // pager : {
  //   size : null,
  //   autoHidden : false,
  //   perfect : true,
  //   pageSize : 10,
  //   pagerCount : 7,
  //   pageSizes : [10, 15, 20, 50, 100],
  //   layouts : ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total']
  // },
  // form : {
  //   preventSubmit : false,
  //   size : null,
  //   colon : false,
  //   validConfig : {
  //     autoPos : true
  //   },
  //   tooltipConfig : {
  //     enterable : true
  //   },
  //   titleAsterisk : true
  // },
  input: {
    clearable: true,
    // size : 'medium',
    // transfer : false,
    // parseFormat : 'yyyy-MM-dd HH:mm:ss.SSS',
    // labelFormat : '',
    // valueFormat : '',
    // startDay : 1,
    // digits : 2,
    // controls : true
  },
  textarea: {
    size: null,
    autosize: {
      minRows: 1,
      maxRows: 10,
    },
  },
  // // Internationalize the prompts built into the component
  // i18n : ( key, args ) => i18n.global.t( key, args ),
  //
  // // Optional, automatically translate the column headers, verification prompts, etc. in the parameters (only valid for those that support internationalization)）
  // translate( key, args ) {
  // // For example, only translate keys starting with "app."
  //   if ( key && key.indexOf( 'app.' ) > -1 ) {
  //     return i18n.global.t( key, args )
  //   }
  //   return key
  // }
  // select : {
  //   size : null,
  //   transfer : false,
  //   optionConfig : {
  // keyField: '_X_OPTION_KEY' // The unique primary key field name of option data
  //   },
  //   multiCharOverflow : 8
  // },
  // toolbar : {
  //   size : null,
  //   import : {
  //     mode : 'covering'
  //   },
  //   export : {
  //     types : ['csv', 'html', 'xml', 'txt']
  //   },
  //   custom : {
  //     isFooter : true
  //   },
  //   buttons : [],
  //   tools : []
  // },
  // button : {
  //   size : null,
  //   transfer : false
  // },
  // radio : {
  //   size : null
  // },
  // checkbox : {
  //   size : null
  // },
  // switch : {
  //   size : null
  // },
  // modal : {
  //   // size: null,
  //   minWidth : 340,
  //   minHeight : 200,
  //   lockView : true,
  //   mask : true,
  //   duration : 3000,
  //   marginSize : 0,
  //   dblclickZoom : true,
  //   showTitleOverflow : true,
  //   storage : false
  // },
  // list : {
  //   scrollY : {
  //     gt : 100
  //   }
  // }
})

export function useTable(app) {
  app
    .use(Icon)
    .use(Filter)
    .use(Edit)
    .use(Menu)
    .use(Export)
    .use(Keyboard)
    .use(Validator)
    // optional components
    .use(Column)
    .use(Colgroup)
    .use(Grid)
    .use(Tooltip)
    .use(Toolbar)
    .use(Pager)
    .use(Form)
    .use(FormItem)
    .use(FormGather)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Radio)
    .use(RadioGroup)
    .use(RadioButton)
    .use(Switch)
    .use(Input)
    .use(Select)
    .use(Optgroup)
    .use(Option)
    .use(Textarea)
    .use(Button)
    .use(Modal)
    .use(List)
    .use(Pulldown)
    // Install form
    .use(Table)
}
