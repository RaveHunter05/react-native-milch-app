import { useState } from 'react';
import { Modal, View } from 'react-native';

import RNDateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

type DateTimePickerType = {
    mode: 'date' | 'time' | 'datetime';
    title: string;
};

export default function useDateTimePicker<T>({
    mode = 'date',
    title,
}: DateTimePickerType) {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const onChange = (event: DateTimePickerEvent, date?: Date) => {
        if (date) {
            const currentDate = date;
            setDate(currentDate);
        }
        setShow(false);
    };

    const switchModalVisibility = () => {
        setShow(!show);
    };

    const DatePickerComponent = () => {
        return (
            <View>
                <Modal visible={show}>
                    <RNDateTimePicker
                        value={date}
                        mode={mode}
                        display="default"
                        onChange={onChange}
                        maximumDate={new Date()}
                        style={{ width: 320, backgroundColor: 'white' }}
                    />
                </Modal>
            </View>
        );
    };

    return {
        DatePickerComponent,
        switchModalVisibility,
        date,
    };
}
