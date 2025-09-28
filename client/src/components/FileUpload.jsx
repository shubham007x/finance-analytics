import React, { useState } from 'react';
import { uploadFile } from '../services/api';

const FileUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const [error, setError] = useState(null);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setError(null);
        setUploadResult(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            setError('Please select a file');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const result = await uploadFile(file);
            setUploadResult(result);
            onUploadSuccess(result);
            setFile(null);
            // Reset file input
            event.target.reset();
        } catch (error) {
            setError(error.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Upload Bank Statement
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select File (PDF, CSV, or TXT)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                            <div className="space-y-1 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                        <span>Upload a file</span>
                                        <input
                                            type="file"
                                            className="sr-only"
                                            accept=".pdf,.csv,.txt"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PDF, CSV, TXT up to 10MB
                                </p>
                            </div>
                        </div>
                        {file && (
                            <p className="mt-2 text-sm text-gray-600">
                                Selected: {file.name} ({formatFileSize(file.size)})
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!file || uploading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {uploading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Upload and Parse'
                        )}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {uploadResult && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
                        <h3 className="text-sm font-medium text-green-800">Upload Successful!</h3>
                        <p className="text-sm text-green-600 mt-1">
                            Found {uploadResult.transactionsFound} transactions in {uploadResult.filename}
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Supported File Formats
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                        <div className="text-red-500 text-2xl mb-2">📄</div>
                        <h4 className="font-medium">PDF</h4>
                        <p className="text-sm text-gray-600">Bank statement PDFs</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <div className="text-green-500 text-2xl mb-2">📊</div>
                        <h4 className="font-medium">CSV</h4>
                        <p className="text-sm text-gray-600">Exported transaction data</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <div className="text-blue-500 text-2xl mb-2">📝</div>
                        <h4 className="font-medium">TXT</h4>
                        <p className="text-sm text-gray-600">Plain text statements</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
