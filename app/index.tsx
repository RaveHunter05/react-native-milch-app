import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import Login from '../app/Login';

export default function Page() {
    return (
        <ThemeProvider value={DarkTheme}>
            <Login />
        </ThemeProvider>
    );
}
