import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  DateTimePicker,
  DateTimePickerProps,
} from "@mui/x-date-pickers/DateTimePicker";

const BasicDatePicker = (props: DateTimePickerProps<Date>) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker {...props} />
    </LocalizationProvider>
  );
};
BasicDatePicker.muiName = "DatePicker";

export default BasicDatePicker;
