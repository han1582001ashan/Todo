import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import ListTasks from "@/components/ListTasks";
import ListTasksPagination from "@/components/ListTasksPagination";
import StatsAndFilter from "@/components/StatsAndFilter";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";

import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";
const HomePage = () => {
    const [taskBuffer, setTaskBuffer] = useState([]);
    const [activeTaskCount, setActiveTaskCount] = useState(0);
    const [completedTaskCount, setCompletedTaskCount] = useState(0);
    const [filter, setFilter] = useState("all");
    const [dateQuery, setDateQuery] = useState('today');
    const [page, setPage] = useState(1);
    useEffect(() => {
        fetchTasks();
    }, [dateQuery])

    useEffect(() => {
        setPage(1)
    }, [filter, dateQuery]);
    const fetchTasks = async () => {
        try {
            const res = await api.get(`/tasks?filter=${dateQuery}`);
            setTaskBuffer(res.data.tasks);
            setActiveTaskCount(res.data.activeCount);
            setCompletedTaskCount(res.data.completeCount);
            console.log(res.data);
        } catch (error) {
            console.error("lỗi truy xuất tasks:", error);
            toast.error("Lỗi truy xuất danh sách nhiệm vụ");
        }
    }
    const filteredTasks = taskBuffer.filter((task) => {
        switch (filter) {
            case "active":
                return task.status === 'active';
            case "completed":
                return task.status === 'complete';
            default:
                return true;
        }
    });
    const visibleTasks = filteredTasks.slice(
        (page - 1) * visibleTaskLimit, page * visibleTaskLimit

    );

    const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

    const handleTaskChanged = () => {
        fetchTasks();
    };
    const handleNextPage = () => {
        if (page < totalPages) {
            setPage((prev) => prev + 1);
        }
    };
    const handlePrePage = () => {
        if (page >= 1) {
            setPage((prev) => prev - 1);
        }
    }
    const handlePageChange = (newPage) => {
        setPage(newPage);
    } 
    if (visibleTasks.length === 0) {
        handlePrePage();
    }
    return (

        <div className="min-h-screen w-full bg-[#020617] relative">
            {/* Dark Sphere Grid Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: "#020617",
                    backgroundImage: `
        linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
        radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)
      `,
                    backgroundSize: "32px 32px, 32px 32px, 100% 100%",
                }}
            />
            <div className="container pt-8 mx-auto relative z-10">
                <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
                    <Header />
                    <AddTask handleNewTaskAdded={handleTaskChanged} />
                    <StatsAndFilter
                        filter={filter}
                        setFilter={setFilter}
                        activeTasksCount={activeTaskCount}
                        completedTasksCount={completedTaskCount}
                    />
                    <ListTasks filteredTasks={visibleTasks} filter={filter} handleTaskChanged={handleTaskChanged} />

                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <ListTasksPagination handleNextPage={handleNextPage}
                            handlePrePage={handlePrePage}
                            handlePageChange={handlePageChange}
                            page={page}
                            totalPages={totalPages}
                        />
                        <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
                    </div>
                    <Footer activeTaskCount={activeTaskCount}
                        completedTaskCount={completedTaskCount}

                    />

                </div>


            </div>
        </div>



    )
};
export default HomePage;