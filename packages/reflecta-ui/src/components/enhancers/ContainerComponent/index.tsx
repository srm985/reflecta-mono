import {
    Outlet
} from 'react-router-dom';

const ContainerComponent = () => (
    <>
        <nav />
        <Outlet />
        <footer />
    </>
);

export default ContainerComponent;
