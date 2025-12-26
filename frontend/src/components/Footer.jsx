import React from "react";
const Footer = ({ completedTaskCount = 0, activeTaskCount = 0}) => {
    return (
        <>
            {completedTaskCount + activeTaskCount > 0 && (
                <div className="text-center ">
                    <p className="text-sm text-muted-foreground">
                        {
                            completedTaskCount > 0 && (

                                <>
                                    Bạn đã hoàn thành {completedTaskCount} việc {activeTaskCount > 0 && `.Còn ${activeTaskCount} chưa xong. Cố lên nhé!!!`}
                                </>
                            )
                        }
                        {completedTaskCount === 0 && activeTaskCount > 0 && (
                            <>
                                Hãy bắt đầu nào
                            </>

                        )}

                    </p>

                </div>
            )}
        </>
    )
};
export default Footer;