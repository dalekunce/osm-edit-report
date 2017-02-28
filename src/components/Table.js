import React from 'react';
import {abbreviateNumber} from '../helper';
import FixedDataTable, {Table, Column, Cell } from 'fixed-data-table';
import Section from './Section';
import R from 'ramda';
import 'fixed-data-table/dist/fixed-data-table.css';
import Dimensions from 'react-dimensions';

var SortTypes = {

    ASC: 'ASC',
    DESC: 'DESC',
};
function isObject(val) {
    return (typeof val === 'object');
}
function reverseSortDirection(sortDir) {
    return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

class SortHeaderCell extends React.Component {
    constructor(props) {
        super(props);

        this._onSortChange = this._onSortChange.bind(this);
    }

    render() {
        var {sortDir, children, ...props} = this.props;
        return (
            <Cell {...props}>
                <a onClick={this._onSortChange}>
                    {children} {sortDir ? (sortDir === SortTypes.DESC ? '↓' : '↑') : ''}
                </a>
            </Cell>
        );
    }

    _onSortChange(e) {
        e.preventDefault();

        if (this.props.onSortChange) {
            this.props.onSortChange(
                this.props.columnKey,
                this.props.sortDir ?
                    reverseSortDirection(this.props.sortDir) :
                    SortTypes.DESC
            );
        }
    }
}

const TextCell = ({rowIndex, data, columnKey, ...props}) => {
    let cell = data.getObjectAt(rowIndex)[columnKey];
    if (isObject(cell)) {
        cell = cell.c + cell.m + cell.d;
    }
    return (
        <Cell {...props}>
            {cell}
        </Cell>
    );
};
   

class DataListWrapper {
    constructor(indexMap, data) {
        this._indexMap = indexMap;
        this._data = data;
    }

    getSize() {
        return this._indexMap.length;
    }

    getObjectAt(index) {
        return this._data[
            this._indexMap[index]
        ];
    }
}


class MyTable extends React.Component {
    constructor(props) {
        super(props);

        debugger;
        this._dataList = this.props.data.getAllUsers();
        this.state = {
            sortedDataList: new DataListWrapper(R.range(0, this._dataList.length), this._dataList),
            colSortDirs: {},
        };

        this._onSortChange = this._onSortChange.bind(this);
    }

    _onSortChange(columnKey, sortDir) {
        var sortIndexes = this._defaultSortIndexes.slice();
        sortIndexes.sort((indexA, indexB) => {
            var valueA = this._dataList.getObjectAt(indexA)[columnKey];
            var valueB = this._dataList.getObjectAt(indexB)[columnKey];
            var sortVal = 0;
            if (valueA > valueB) {
                sortVal = 1;
            }
            if (valueA < valueB) {
                sortVal = -1;
            }
            if (sortVal !== 0 && sortDir === SortTypes.ASC) {
                sortVal *= -1;
            }

            return sortVal;
        });

        this.setState({
            sortedDataList: new DataListWrapper(sortIndexes, this._dataList),
            colSortDirs: {
                [columnKey]: sortDir,
            },
        });
    }

    render() {
        var {sortedDataList, colSortDirs} = this.state;
        return (
            <Table
                rowHeight={50}
                rowsCount={sortedDataList.getSize()}
                headerHeight={50}
                width={this.props.containerWidth}
                height={500}
                {...this.props}>
                <Column
                    columnKey="id"
                    header={
                        <SortHeaderCell
                            sortDir={colSortDirs.id}>
                            id
                    </SortHeaderCell>
                    }
                    cell={<TextCell data={sortedDataList} />}
                    width={100}
                />
                <Column
                    columnKey="username"
                    header={
                        <SortHeaderCell
                            sortDir={colSortDirs.username}>
                            Username
                        </SortHeaderCell>
                    }
                    cell={<TextCell data={sortedDataList} />}
                    width={200}
                />
                <Column
                    columnKey="changesets"
                    header={
                        <SortHeaderCell
                            sortDir={colSortDirs.changesets}>
                            Changesets
                        </SortHeaderCell>
                    }
                    cell={<TextCell data={sortedDataList} />}
                    width={200}
                />
                <Column
                    columnKey="objects"
                    header={
                        <SortHeaderCell
                            sortDir={colSortDirs.objects}>
                            Objects
                        </SortHeaderCell>
                    }
                    cell={<TextCell data={sortedDataList} />}
                    width={200}
                />
                <Column
                    columnKey="objects"
                    header={
                        <SortHeaderCell
                            sortDir={colSortDirs.objects}>
                            Objects
                        </SortHeaderCell>
                    }
                    cell={<TextCell data={sortedDataList} />}
                    width={200}
                />

      
            </Table>
        );
    }
}
MyTable = Dimensions()(MyTable);

export default function UserTable({ data }) {
    if (!data) return null;
    return (
        <Section title="Users"
            titleRightBottom=""
            titleBottom={`Total: ${abbreviateNumber(200)}`}
            titleRight="&nbsp;"
        >
            <MyTable data={data} />
        </Section>
    )
}
