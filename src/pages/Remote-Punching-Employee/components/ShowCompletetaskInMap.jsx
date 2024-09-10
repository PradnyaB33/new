// import axios from 'axios';
import React from 'react'
import usePunchNotification from '../../../hooks/QueryHook/notification/punch-notification/hook';
// import { useQuery } from 'react-query';
// import { useParams } from 'react-router-dom'
// import { UseContext } from '../../../State/UseState/UseContext';

const ShowCompletetaskInMap = () => {
    const { data: punchNotifications } = usePunchNotification();
    console.log("punchNotifications", punchNotifications);

    // const { Id } = useParams();
    // console.log("assas", Id);
    // const { cookies } = useContext(UseContext);
    // const authToken = cookies["aegis"];
    // const { data, isLoading } = useQuery(
    //     `remote-punching-${Id}-post`,
    //     async () => {
    //         try {
    //             const response = await axios.get(
    //                 `${process.env.REACT_APP_API}/route/punch-entry/${Id}`,
    //                 {
    //                     headers: {
    //                         Authorization: authToken,
    //                     },

    //                 }
    //             );
    //             return response.data;
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //             throw error; // Rethrow the error to be caught by React Query
    //         }
    //     }
    // );

    return (
        <div>

        </div>
    )
}

export default ShowCompletetaskInMap
