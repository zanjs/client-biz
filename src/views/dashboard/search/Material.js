import React from 'react';
import { observer } from 'mobx-react';
// import {
//   Table,
//   TableBody,
//   TableHeader,
//   TableHeaderColumn,
//   TableRow,
//   TableRowColumn,
// } from 'material-ui/Table';
//
// import CircularProgress from 'material-ui/CircularProgress';
import MaterialsStore from '../../stores/materials';


@observer
export default class Materials extends React.Component {
  componentWillMount() {
    MaterialsStore.load();
  }

  // Content = () => {
  //   if (MaterialsStore.loading) return <div style={{textAlign: 'center', padding: 20}}><CircularProgress /></div>
  //   else {
  //     return (
  //       <Table className="materials-list">
  //         <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
  //           <TableRow displayRowCheckbox={false}>
  //             <TableHeaderColumn style={{width: 30}}>ID</TableHeaderColumn>
  //             <TableHeaderColumn>物料名称</TableHeaderColumn>
  //             <TableHeaderColumn style={{width: 50}}>自定义物料编码</TableHeaderColumn>
  //             <TableHeaderColumn style={{width: 100}}>物料规格</TableHeaderColumn>
  //             <TableHeaderColumn style={{width: 50}}>单位</TableHeaderColumn>
  //             <TableHeaderColumn style={{width: 50}}>单价</TableHeaderColumn>
  //             <TableHeaderColumn style={{width: 100}}>操作</TableHeaderColumn>
  //           </TableRow>
  //         </TableHeader>
  //         <TableBody showRowHover>
  //           {/*{detail.goods_list && detail.goods_list.map((item, index) => (*/}
  //           {/*<TableRow key={index} selectable={true}>*/}
  //           {/*<TableRowColumn style={{...styles.noPadding, width: 20}}>{item.line_no || 0}</TableRowColumn>*/}
  //           {/*<TableRowColumn style={{...styles.noPadding, width: 40}}>{item.goods_no || 0}</TableRowColumn>*/}
  //           {/*{*/}
  //           {/*detail.type === DetailContentType.SALE_ORDER && <TableRowColumn*/}
  //           {/*style={{...styles.noPadding, width: 70}}>{item.client_goods_no || 0}</TableRowColumn>*/}
  //           {/*}*/}
  //           {/*<TableRowColumn style={styles.noPadding}>{item.name || '暂无'}</TableRowColumn>*/}
  //           {/*<TableRowColumn style={styles.noPadding}>{item.size || '暂无'}</TableRowColumn>*/}
  //           {/*<TableRowColumn style={{...styles.noPadding, width: 30}}>{item.count || 0}</TableRowColumn>*/}
  //           {/*<TableRowColumn style={{...styles.noPadding, width: 30}}>{item.unit || '暂无'}</TableRowColumn>*/}
  //           {/*<TableRowColumn style={{...styles.noPadding, width: 40}}>{item.unit_price || 0}{item.discount}</TableRowColumn>*/}
  //           {/*<TableRowColumn style={styles.noPadding}>{item.total_price}</TableRowColumn>*/}
  //           {/*<TableRowColumn style={styles.noPadding}>{item.due_date ? formatTime(item.due_date, 'YYYY/M/D') : '暂无'}</TableRowColumn>*/}
  //           {/*</TableRow>*/}
  //           {/*))}*/}
  //         </TableBody>
  //       </Table>
  //     )
  //   }
  // };

  render() {
    return (
      <div className="search-content materials-container">
        {/*<this.Content />*/}
      </div>
    );
  }
}

