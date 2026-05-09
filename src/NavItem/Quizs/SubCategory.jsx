import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../Axios/AxiosInstance';
import Loading from '../../Loading/Loading';
import { ChevronRight } from 'lucide-react';

const SubCategory = () => {
    const{Category}=useParams();
    const navigate=useNavigate();
       const {data,isLoading}=useQuery({
        queryKey:['quizzes'],
        queryFn:async()=>{
            const res=await axiosInstance.get('/quizes')
            return res.data;
        }
    })
    const handleVeiwDetails=(category,subCategory)=>navigate(`/quizzes/${category}/${subCategory}`);
    if(isLoading) return <Loading/>

    const filteredData=data.filter(res=>res.quiz.category==Category)
    
 
    return (
        <>
         <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent inline-block">
                    Quiz Sub Categories ({Category})
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 mx-auto mt-3 rounded-full"></div>
            </div>
        
        <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((res, index) => (
                    <div 
                    onClick={()=>handleVeiwDetails(res?.quiz?.category,res?.quiz?.subcategory)}
                        key={index} 
                        className="group cursor-pointer transition-all duration-300 hover:scale-105"
                    >
                        <div className="p-[2px] bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl transition-all duration-300 group-hover:shadow-xl group-hover:shadow-purple-500/25">
                            <div className="bg-white rounded-xl p-5">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-gray-800 font-bold text-xl">
                                        {res?.quiz?.subcategory || 'Uncategorized'}
                                    </h2>

                                    {/* Thumbel Img section  */}
                                    
                                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-2 group-hover:translate-x-1 transition-transform">
                                        <ChevronRight size={16} className="text-white" />
                                    </div>
                                </div>
                                
                                {/* Optional: Add quiz info */}
                                {res?.quiz?.description && (
                                    <p className="text-gray-500 text-sm mt-2">
                                        {res.quiz.description}
                                    </p>
                                )}
                                
                                {/* Optional: Add question count */}
                                {res?.quiz?.questions?.length && (
                                    <div className="mt-3 text-xs text-gray-400">
                                        {res.quiz.questions.length} questions
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default SubCategory;