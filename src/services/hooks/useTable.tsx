import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { Table, Row, Rows } from 'react-native-table-component';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

export default function useTable<T>(
    fetchFunction: () => Promise<AxiosResponse>,
) {
    const [tableHeaders, setTableHeaders] = useState<string[]>([]);
    const [tableData, setTableData] = useState<string[][]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {
        const getData = async () => {
            try {
                const response: AxiosResponse = await fetchFunction();
                {
                    if (response.status === 200) {
                        setTableHeaders(Object.keys(response.data[0]));
                        const data = response.data.map((element: T) => {
                            return Object.values(element);
                        });
                        setTableData(data);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [refresh]);

    const MyTableComponent = () => {
        if (!tableData.length)
            return (
                <View>
                    <FontAwesome6
                        name="table-cells-large"
                        size={24}
                        color="black"
                    />
                    <Text> No hay datos por el momento, vacío </Text>
                </View>
            );
        return (
            <>
                <Table borderStyle={{ borderWidth: 2, borderColor: 'black' }}>
                    <Row
                        data={tableHeaders}
                        textStyle={styles.headerText}
                        className="bg-orange-300 h-11"
                    />
                    <Rows
                        data={tableData}
                        style={[styles.row, { backgroundColor: '#fff' }]}
                        textStyle={styles.text}
                    />
                </Table>
            </>
        );
    };

    return { MyTableComponent, refresh, setRefresh };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
        backgroundColor: '#fff',
    },
    headerText: {
        textAlign: 'center',
        color: '#000',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    text: { textAlign: 'center', fontWeight: '100' },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#E7E6E1' },
});
