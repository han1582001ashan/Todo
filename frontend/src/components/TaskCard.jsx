import React, { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar, CheckCircle, CheckCircle2, Circle, SquarePen, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Input } from "./ui/input";
const TaskCard = ({ task, index, handleTaskChanged }) => {

    const [isEditting, setIsEditting] = useState(false);
    const [updateTaskTitle, setUpDateTaskTitle] = useState(task.title || "");



    const deleteTask = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            toast.success("Xóa nhiệm vụ thành công");
            handleTaskChanged();

        } catch (error) {
            console.error("Lỗi khi xóa nhiệm vụ", error);
            toast.error("Lỗi khi xóa nhiệm vụ");
        }
    }
    const updateTask = async () => {
        try {
            setIsEditting(false);
            await api.put(`/tasks/${task._id}`, {
                title: updateTaskTitle
            });
            toast.success("Sửa thành công");
            handleTaskChanged();
        } catch (error) {
            console.error("Lỗi khi sửa nhiệm vụ", error);
            toast.error("Lỗi khi sửa nhiệm vụ")
        }
    }
    const toggleTaskCompleteButton = async () => {
        try {
            if (task.status === "active") {
                await api.put(`/tasks/${task._id}`, {
                    status: 'complete',
                    completedAt: new Date().toISOString(),
                }); handleTaskChanged();
                toast.success(`${task.title} đã hoàn thành.`)
            }
            else {
                await api.put(`/tasks/${task._id}`, {
                    status: "active",
                    completedAt: null,
                }); handleTaskChanged();
                toast.success(`${task.title} đã đổi sang chưa hoàn thành`)
            }
        } catch (error) {
            console.error("Lỗi khi sửa nhiệm vụ", error);
            toast.error("Lỗi khi sửa nhiệm vụ")
        }
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            updateTask();
        }
    }
    return (
        <Card className={cn(
            "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition=all duration-200 animate-fade-in group",
            task.status === 'complete' && 'opacity-75'
        )}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div
                className="flex item-center gap-4"
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTaskCompleteButton}
                    className={cn(
                        "flex-shrink-0 size=8 rounded-full transition-all duration-200",
                        task.status === 'complete' ? 'text-success hover:text-success/80' : 'text-muted-foreground hover:text-primary'
                    )}
                >
                    {task.status === 'complete' ? (<CheckCircle2 className="size-5" />) : (
                        <Circle className="size-5" />

                    )}

                </Button>
                <div
                    className="flex-1 min-w-0"
                >
                    {isEditting ? (
                        <Input type="text"
                            placeholder="Nhập tên nhiệm vụ"
                            className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
                            value={updateTaskTitle}
                            onChange={(e) => setUpDateTaskTitle(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onBlur={() => {
                                setIsEditting(false);
                                setUpDateTaskTitle(task.title || "");
                            }}

                        />

                    ) : (
                        <p className={cn(
                            "text-base transition-all duration-200",
                            task.status === "complete" ? "line-through text-muted-foreground" : "text-foreground"
                        )}>{task.title}</p>

                    )}
                    <div className="flex item-center gap-2 mt-1">
                        <Calendar
                            className="size-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">

                            {new Date(task.createdAt).toLocaleString()}
                        </span>
                        {task.completedAt && (
                            <>
                                <span className="text-xs text-muted-foreground">-</span>
                                <Calendar className=" size-3  text-xs text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">

                                    {new Date(task.completedAt).toLocaleString()}

                                </span>
                            </>

                        )}
                    </div>

                </div>

                <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="file-shrink-0 transition-color size-8 text-muted-foreground hover:text-info"
                        onClick={() => {
                            setIsEditting(true);
                            setUpDateTaskTitle(task.title || "");
                        }}
                    >
                        <SquarePen className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteTask(task._id)}
                    >
                        <Trash2 className="size-4" />

                    </Button>

                </div>
            </div>

        </Card>
    )
};
export default TaskCard;