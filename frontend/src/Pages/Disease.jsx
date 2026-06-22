import React, { useState, useEffect, useRef } from "react";
import Header from "../Components/Header";
import axios from "axios";
import ChatbotIcon from "../Components/ChatbotIcon";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { ImageOff, RefreshCw, Trash2, Upload, Camera, Microscope, BookOpen, FlaskConical, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

const blobToFile = (blob, fileName) => new File([blob], fileName, { type: blob.type });

const CameraView = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let stream;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => setIsReady(true);
        }
      })
      .catch((err) => {
        console.error("Camera error:", err);
        alert("Could not access camera. Please check permissions.");
        onClose();
      });
    return () => { if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }, [onClose]);

  const handleCapture = () => {
    if (!isReady || !videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    const video = videoRef.current;
    canvasRef.current.width = video.videoWidth;
    canvasRef.current.height = video.videoHeight;
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    canvasRef.current.toBlob((blob) => {
      if (blob) onCapture(blobToFile(blob, `capture-${Date.now()}.jpg`));
      else alert("Failed to capture image.");
    }, "image/jpeg");
  };

  return (
    <div className="space-y-3">
      <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg border border-gray-200 object-cover max-h-48" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex gap-2">
        <button onClick={onClose} type="button" className="flex-1 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button onClick={handleCapture} disabled={!isReady} type="button" className="flex-1 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
          Capture Photo
        </button>
      </div>
    </div>
  );
};

export default function Disease() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [capturedImageFile, setCapturedImageFile] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [expandedId, setExpandedId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/predictions/getPredictions/${currentUser._id}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchHistory(); }, []);

  useEffect(() => {
    if (capturedImageFile) { setImage(capturedImageFile); setUploadedImageFile(null); }
    else if (uploadedImageFile) { setImage(uploadedImageFile); setCapturedImageFile(null); }
    else setImage(null);
  }, [uploadedImageFile, capturedImageFile]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!image) return alert("Please upload or capture an image!");
    const formData = new FormData();
    formData.append("image", image);
    try {
      const res = await axios.post("/api/predictions/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const predictionResult = res.data;
      if (predictionResult.confidence < 0.15) {
        setResult({ invalid: true });
      } else {
        setResult(predictionResult);
        await axios.post(`/api/predictions/createPrediction/${currentUser._id}`, predictionResult);
        fetchHistory();
      }
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Failed to predict disease. Check backend server.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await axios.delete(`/api/predictions/deletePrediction/${id}`);
      fetchHistory();
    } catch (err) {
      alert("Failed to delete prediction.");
    }
  };

  const handleCaptureImage = (file) => { setCapturedImageFile(file); setIsCameraActive(false); };
  const handleUploadImage = (e) => { const file = e.target.files[0]; if (file) { setUploadedImageFile(file); setCapturedImageFile(null); } };
  const clearUploadedImage = () => { setUploadedImageFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; };
  const clearCapturedImage = () => { setCapturedImageFile(null); setIsCameraActive(false); };
  const handleClearHistory = async (userId) => {
    if (!window.confirm("Clear all prediction history?")) return;
    try {
      await axios.delete(`/api/predictions/clearPrediction/${userId}`);
      fetchHistory();
    } catch (err) {
      console.error("Error clearing history:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 ">
        <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-left md:text-left md:flex md:items-left md:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-left justify-left md:justify-start gap-2 ">
                <Microscope className="text-emerald-600" size={26} /> Crop Disease Diagnosis
              </h1>
              <p className="text-slate-500 text-sm mt-1 max-w-xl">
                Upload or capture a leaf photo to identify diseases instantly
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 mb-10">
        {/* Main Scanner + Results */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left: Upload Controls */}
              <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
                <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Upload size={15} className="text-gray-500" />
                  Upload Leaf Image
                </h2>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {/* File Upload Box */}
                  <div
                    className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors min-h-[130px] ${uploadedImageFile ? "border-emerald-300 bg-emerald-50" : "border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
                      }`}
                    onClick={() => !uploadedImageFile && fileInputRef.current?.click()}
                  >
                    {uploadedImageFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <img src={URL.createObjectURL(uploadedImageFile)} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                        <p className="text-xs font-medium text-gray-700 truncate max-w-[110px]">{uploadedImageFile.name}</p>
                        <button type="button" onClick={(e) => { e.stopPropagation(); clearUploadedImage(); }} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                      </div>
                    ) : (
                      <>
                        <Upload size={22} className="text-gray-300 mb-2" />
                        <p className="text-xs font-semibold text-gray-600">Upload File</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, JPEG</p>
                      </>
                    )}
                    <input ref={fileInputRef} id="fileInput" type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
                  </div>

                  {/* Camera Box */}
                  <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 hover:border-emerald-400 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors min-h-[130px]">
                    {isCameraActive ? (
                      <CameraView onCapture={handleCaptureImage} onClose={clearCapturedImage} />
                    ) : capturedImageFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <img src={URL.createObjectURL(capturedImageFile)} alt="captured" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                        <p className="text-xs font-medium text-gray-700">Captured Image</p>
                        <button type="button" onClick={clearCapturedImage} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => { setUploadedImageFile(null); setIsCameraActive(true); }} className="flex flex-col items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors w-full h-full justify-center">
                        <Camera size={22} className="text-gray-300" />
                        <p className="text-xs font-semibold">Use Camera</p>
                        <p className="text-[10px] text-gray-400">Scan in real-time</p>
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCameraActive || !image || loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</>
                  ) : (
                    <><Microscope size={15} /> Analyze Leaf Health</>
                  )}
                </button>
              </div>

              {/* Right: Results */}
              <div className="p-6 bg-gray-50">
                <h2 className="text-sm font-bold text-gray-900 mb-4">Diagnosis Result</h2>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-14 gap-3">
                    <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Running neural diagnosis...</p>
                  </div>
                ) : !result ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                      <Microscope size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400">Upload or snap a leaf photo,<br />then click Analyze to view results.</p>
                  </div>
                ) : result.invalid ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-3">
                      <ImageOff size={20} className="text-red-400" />
                    </div>
                    <p className="text-sm font-bold text-red-600">Invalid Image</p>
                    <p className="text-xs text-gray-500 mt-1">Please provide a clearer, closer photo of the crop leaf.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Identified Disease</p>
                      <p className="text-xl font-bold text-emerald-700 mt-1">{result.prediction}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Confidence Level</p>
                      <div className="flex items-end gap-2 mt-1">
                        <p className="text-xl font-bold text-gray-900">{(result.confidence * 100).toFixed(1)}%</p>
                      </div>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${(result.confidence * 100).toFixed(0)}%` }} />
                      </div>
                    </div>
                  </div>
                )}


              </div>
            </div>
          </div>
        </form>

        {loading ? (
          /* Skeleton Loading State */
          <div className="mt-6 space-y-4 animate-pulse">
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl space-y-3">
              <div className="h-4 w-1/3 bg-emerald-200 rounded"></div>
              <div className="h-10 w-full bg-emerald-100 rounded"></div>
              <div className="space-y-2">
                <div className="h-8 w-full bg-emerald-100 rounded"></div>
                <div className="h-8 w-full bg-emerald-100 rounded"></div>
              </div>
            </div>
          </div>
        ) : result && !result.invalid && result.advice ? (
          /* Actual Content */
          <div className="mt-6 space-y-4">
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
              <h3 className="text-sm font-bold text-emerald-900 mb-2">Agronomist Insights</h3>
              <p className="text-xs text-emerald-800 leading-relaxed mb-3">
                {result.advice.explanation}
              </p>
              <ul className="space-y-2">
                {result.advice.steps.map((step, i) => (
                  <li key={i} className="text-xs text-emerald-800 bg-emerald-100/50 p-2 rounded-lg">
                    {typeof step === 'string' ? (
                      <p className="flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-emerald-600" /> {step}
                      </p>
                    ) : (
                      <>
                        <p className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-emerald-600" /> {step.action}
                        </p>
                        <p className="ml-5 text-[10px] text-emerald-700/80 mt-0.5">
                          {step.description} ({step.method})
                        </p>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
              <p className="text-[10px] text-amber-800 italic">
                {result.advice.disclaimer} Always consult a local expert.
              </p>
            </div>
          </div>
        ) : null}


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NavLink to="/croplibrary/diseasedata" className="group">
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-gray-300 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  <BookOpen size={16} className="text-blue-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">Disease Database Catalog</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">Explore comprehensive information on plant conditions, descriptions, and mitigation strategies.</p>
            </div>
          </NavLink>

          <NavLink to="/disease/diseasesuppliment" className="group">
            <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-gray-300 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <FlaskConical size={16} className="text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">Treatment & Products</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">View treatment solutions, organic bio-fertilizers, and crop supplements from agronomists.</p>
            </div>
          </NavLink>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Diagnosis History</h2>
            <div className="flex gap-2">
              <button
                onClick={fetchHistory}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={12} /> Refresh
              </button>
              <button
                onClick={() => handleClearHistory(currentUser._id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={12} /> Clear All
              </button>
            </div>
          </div>

          <div className="space-y-3 px-5 py-2">
            {history.map((h) => (
              <div key={h._id} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-emerald-200 transition-all">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"

                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${h.advice ? 'bg-emerald-50' : 'bg-gray-100'}`}>
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{h.prediction}</p>
                      <p className="text-[11px] text-gray-500">
                        Confidence: {(h.confidence * 100).toFixed(1)}% • {new Date(h.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedId(expandedId === h._id ? null : h._id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 
      ${expandedId === h._id
                          ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                      <Sparkles size={14} className={expandedId === h._id ? "fill-emerald-500" : ""} />
                      {expandedId === h._id ? "Hide Advice" : "View Advice"}
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(h._id); }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Expanded Advice Section */}
                {expandedId === h._id && h.advice && (
                  <div className="px-4 pb-4 pt-0 border-t border-gray-100 bg-emerald-50/30 animate-in slide-in-from-top-2">
                    <p className="text-xs font-bold text-emerald-900 mt-3 mb-1">Agronomist Recommendation:</p>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">{h.advice.explanation}</p>
                    <div className="grid gap-2">
                      {h.advice.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-2 p-2 bg-white rounded-lg border border-emerald-100">
                          <div className="w-1 bg-emerald-500 rounded-full"></div>
                          <div>
                            <p className="text-[11px] font-bold text-emerald-900">{step.action}</p>
                            <p className="text-[10px] text-gray-500">{step.description} • <span className="uppercase text-[9px] font-semibold">{step.method}</span></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}