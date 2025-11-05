import React, { useState, useEffect } from 'react';
import { Upload, Search, Filter, Grid2x2 as Grid, List, Play, Download, Trash2, CreditCard as Edit, Image, Video, FileText, Music } from 'lucide-react';
import { MediaAsset } from '../../types/course';

interface MediaLibraryProps {
  instructorId: string;
}

export function MediaLibrary({ instructorId }: MediaLibraryProps) {
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'audio' | 'document'>('all');
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    loadMediaAssets();
  }, [instructorId]);

  const loadMediaAssets = async () => {
    // Mock data - in real app, fetch from API
    const mockAssets: MediaAsset[] = [
      {
        id: '1',
        type: 'image',
        url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=200',
        title: 'Course Hero Image',
        description: 'Main hero image for React course',
        size: 1024000,
        mimeType: 'image/jpeg',
        uploadedAt: '2024-01-15T10:00:00Z',
        uploadedBy: instructorId
      },
      {
        id: '2',
        type: 'video',
        url: 'https://example.com/intro-video.mp4',
        thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200',
        title: 'Course Introduction Video',
        description: 'Welcome video for new students',
        duration: 180,
        size: 50000000,
        mimeType: 'video/mp4',
        uploadedAt: '2024-01-14T15:30:00Z',
        uploadedBy: instructorId
      },
      {
        id: '3',
        type: 'document',
        url: 'https://example.com/course-outline.pdf',
        title: 'Course Outline PDF',
        description: 'Detailed course curriculum and schedule',
        size: 2048000,
        mimeType: 'application/pdf',
        uploadedAt: '2024-01-13T09:15:00Z',
        uploadedBy: instructorId
      }
    ];
    setMediaAssets(mockAssets);
  };

  const handleFileUpload = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const assetId = `upload-${Date.now()}-${i}`;
      
      // Start upload progress
      setUploadProgress(prev => ({ ...prev, [assetId]: 0 }));
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[assetId] || 0;
          if (currentProgress >= 100) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [assetId]: currentProgress + 10 };
        });
      }, 200);

      // Simulate upload completion
      setTimeout(() => {
        const newAsset: MediaAsset = {
          id: assetId,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' :
                file.type.startsWith('audio/') ? 'audio' : 'document',
          url: URL.createObjectURL(file),
          thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          title: file.name,
          description: `Uploaded ${file.name}`,
          duration: file.type.startsWith('video/') || file.type.startsWith('audio/') ? 120 : undefined,
          size: file.size,
          mimeType: file.type,
          uploadedAt: new Date().toISOString(),
          uploadedBy: instructorId
        };

        setMediaAssets(prev => [newAsset, ...prev]);
        setUploadProgress(prev => {
          const { [assetId]: _, ...rest } = prev;
          return rest;
        });
      }, 2000);
    }
  };

  const filteredAssets = mediaAssets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || asset.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Music;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
      } else {
        newSet.add(assetId);
      }
      return newSet;
    });
  };

  const deleteSelectedAssets = () => {
    setMediaAssets(prev => prev.filter(asset => !selectedAssets.has(asset.id)));
    setSelectedAssets(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
          <p className="text-gray-600">Manage your course media assets</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedAssets.size > 0 && (
            <button
              onClick={deleteSelectedAssets}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 size={18} />
              Delete ({selectedAssets.size})
            </button>
          )}
          <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer">
            <Upload size={18} />
            Upload Media
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Uploading Files</h3>
          <div className="space-y-2">
            {Object.entries(uploadProgress).map(([id, progress]) => (
              <div key={id} className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="document">Documents</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map(asset => {
            const FileIcon = getFileIcon(asset.type);
            return (
              <div
                key={asset.id}
                className={`bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer ${
                  selectedAssets.has(asset.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleAssetSelection(asset.id)}
              >
                <div className="aspect-video bg-gray-100 rounded-t-xl overflow-hidden relative">
                  {asset.type === 'image' ? (
                    <img
                      src={asset.thumbnail || asset.url}
                      alt={asset.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileIcon size={48} className="text-gray-400" />
                    </div>
                  )}
                  {asset.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(asset.duration)}
                    </div>
                  )}
                  {selectedAssets.has(asset.id) && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{asset.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{asset.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(asset.size)}</span>
                    <span>{new Date(asset.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredAssets.map(asset => {
              const FileIcon = getFileIcon(asset.type);
              return (
                <div
                  key={asset.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    selectedAssets.has(asset.id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => toggleAssetSelection(asset.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {asset.type === 'image' ? (
                        <img
                          src={asset.thumbnail || asset.url}
                          alt={asset.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileIcon size={24} className="text-gray-400" />
                        </div>
                      )}
                      {selectedAssets.has(asset.id) && (
                        <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          ✓
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{asset.title}</h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {asset.type}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{asset.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatFileSize(asset.size)}</span>
                        {asset.duration && <span>{formatDuration(asset.duration)}</span>}
                        <span>Uploaded {new Date(asset.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download size={16} />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No media files yet</h3>
          <p className="text-gray-600 mb-4">Upload images, videos, and documents for your courses.</p>
          <label className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 cursor-pointer">
            <Upload size={20} />
            Upload Your First File
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}