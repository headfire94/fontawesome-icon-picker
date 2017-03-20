import React, {
    Component,
    PropTypes
} from 'react';
import FontAwesome from 'react-fontawesome';
import {FONT_AWESOME_LIST} from './fontAwesomeList';
import Select from 'react-select';
import {Collection, AutoSizer} from 'react-virtualized';
// Virtualized так как элементов >600

class IconPicker extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        defaultValue: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            selected: props.defaultValue || '0'
        };

        this.renderMenu = this.renderMenu.bind(this);
        this.cellSizeAndPositionGetter = this.cellSizeAndPositionGetter.bind(this);
        this.renderOption = this.renderOption.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultValue !== this.props.defaultValue) {
            this.setState({
                selected: nextProps.defaultValue || '0'
            });
        }
    }

    handleSelect(option) {
        this.setState({
            selected: option.id
        });

        if (typeof this.props.onChange === 'function') {
            this.props.onChange(option.id);
        }
    }

    renderOption({focusOption, key, option, selectValue, style}) {
        return (
            <div
                className="icon-picker__item"
                key={key}
                onClick={() => selectValue(option)}
                onMouseOver={() => focusOption(option)}
                style={style}
            >
                <FontAwesome tag="i" name={option.shortName}/>
            </div>
        );
    }

    renderMenu({focusedOption, focusOption, labelKey, onSelect, options, valueArray}) {
        // пробрасываем пропсы для опции селекта
        const wrappedOptionRenderer = ({index, key, style}) => {
            const option = FONT_AWESOME_LIST[index];
            const innerRenderOption = this.renderOption;

            return innerRenderOption({
                focusedOption,
                focusOption,
                key,
                labelKey,
                onSelect,
                option,
                optionIndex: index,
                options,
                selectValue: onSelect,
                style,
                valueArray
            });
        };

        return (
            <AutoSizer disableHeight>
                {({width}) => (
                    <Collection
                        cellCount={FONT_AWESOME_LIST.length}
                        cellRenderer={wrappedOptionRenderer}
                        cellSizeAndPositionGetter={this.cellSizeAndPositionGetter}
                        height={180}
                        width={width }
                    />
                )}
            </AutoSizer>
        );
    }

    cellSizeAndPositionGetter({index}) {
        // Способ пересчета
        // const columnCount = 4;
        // const columnPosition = index % (columnCount || 1);
        //
        // const height = 40;
        // const width = 40;
        // const x = columnPosition * (10 + width);
        // const y = this.columnYMap[columnPosition] || 0;
        //
        // this.columnYMap[columnPosition] = y + height + 10;

        const height = 40;
        const width = 40;
        const x = FONT_AWESOME_LIST[index].x; // Захардкодил, т.к. пересчет занимает ~0,5сек и селект не открывается в этом время
        const y = FONT_AWESOME_LIST[index].y;

        return {
            height,
            width,
            x,
            y
        };
    }

    render() {
        const {selected} = this.state,
            {placeholder} = this.props;

        return (
            <div className="icon-picker">
                <Select options={FONT_AWESOME_LIST}
                        placeholder={placeholder || ''}
                        value={selected}
                        clearable={false}
                        valueKey="id"
                        labelKey="name"
                        menuRenderer={this.renderMenu}
                        onChange={value => this.handleSelect(value)}
                        className="icon-picker__select"
                        searchable={true}
                />
                <button
                    type="button"
                    className="icon-picker__btn btn btn-primary">
                    {
                        selected !== null &&
                        <FontAwesome name={FONT_AWESOME_LIST.find(item => item.id === selected).shortName}
                                     tag="i"/>
                    }
                </button>
            </div>
        );
    }
}

export default IconPicker;