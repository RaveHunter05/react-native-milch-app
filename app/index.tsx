import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import Login from '../app/Login';
import FlashMessage from 'react-native-flash-message';
import 'react-native-gesture-handler';

export default function Page() {
    return (
        <ThemeProvider value={DarkTheme}>
            <FlashMessage position="top" />
            <Login />
        </ThemeProvider>
    );
}
