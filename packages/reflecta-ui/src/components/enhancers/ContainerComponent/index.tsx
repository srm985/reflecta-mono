import {
    Outlet
} from 'react-router-dom';

const ContainerComponent = () => (
    <>
        <nav />
        <main>
            <Outlet />
        </main>
        <footer />
    </>
);

export default ContainerComponent;
