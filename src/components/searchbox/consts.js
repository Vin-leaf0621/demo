import { DatePicker, Input, InputNumber, Select } from 'antd';
import SearchSelect from '../searchselect';
import CitySelector from '../cityselector';

const { RangePicker } = DatePicker;

export const RENDER_ITEM_TYPE = {
  input: Input,
  inputNumber: InputNumber,
  select: Select,
  datePicker: DatePicker,
  rangePicker: RangePicker,
  searchselect: SearchSelect,
  cityselector: CitySelector,
};
