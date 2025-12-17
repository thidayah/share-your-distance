'use client'

import { useState, useEffect } from 'react'
import { CategoryCreate } from '@/lib/supabase/service/categories/types'

interface CategoryFeature {
  feature: string
  display_order: number
}

interface Category {
  id: string
  name: string
  description: string
  price: number
  distance: string
  image_url?: string
  recommended?: boolean
  is_active?: boolean
  max_participants?: number
  min_age?: number
  max_age?: number
  health_warning?: string
  display_order?: number
  category_features: CategoryFeature[]
}

interface CategoryModalProps {
  category?: Category | null
  onSubmit: (data: CategoryCreate, features: string[]) => void
  onClose: () => void
  loading: boolean
}

export default function CategoryModal({
  category,
  onSubmit,
  onClose,
  loading
}: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    distance: '',
    image_url: '',
    recommended: false,
    is_active: false,
    max_participants: 0,
    min_age: 0,
    max_age: 0,
    health_warning: '',
  })

  const [features, setFeatures] = useState<string[]>([''])

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        price: category.price,
        distance: category.distance,
        image_url: category.image_url || '',
        recommended: category.recommended || false,
        is_active: category.is_active || false,
        max_participants: category.max_participants || 0,
        min_age: category.min_age || 0,
        max_age: category.max_age || 0,
        health_warning: category.health_warning || '',
      })
      setFeatures(
        category.category_features.length > 0
          ? category.category_features.map(f => f.feature)
          : ['']
      )
    }
  }, [category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Filter out empty features
    const nonEmptyFeatures = features.filter(feature => feature.trim() !== '')

    onSubmit(formData, nonEmptyFeatures)
  }

  const addFeature = () => {
    setFeatures(prev => [...prev, ''])
  }

  const updateFeature = (index: number, value: string) => {
    setFeatures(prev => prev.map((f, i) => i === index ? value : f))
  }

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-zinc-200">
          <h2 className="text-xl font-semibold text-zinc-900">
            {category ? 'Edit Category' : 'Create New Category'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 text-zinc-700  border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 text-zinc-700  border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Distance *
              </label>
              <input
                type="text"
                required
                value={formData.distance}
                onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
                className="w-full px-3 py-2 text-zinc-700  border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                placeholder="e.g., 5km, 10km, Half Marathon"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Max Participants
              </label>
              <input
                type="number"
                min="0"
                value={formData.max_participants}
                onChange={(e) => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 text-zinc-700  border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Min Age
              </label>
              <input
                type="number"
                min="0"
                value={formData.min_age}
                onChange={(e) => setFormData(prev => ({ ...prev, min_age: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 text-zinc-700  border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Max Age
              </label>
              <input
                type="number"
                min="0"
                value={formData.max_age}
                onChange={(e) => setFormData(prev => ({ ...prev, max_age: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 text-zinc-700  border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 text-zinc-700  border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              className="w-full px-3 py-2 text-zinc-700  border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Health Warning
            </label>
            <textarea
              rows={2}
              value={formData.health_warning}
              onChange={(e) => setFormData(prev => ({ ...prev, health_warning: e.target.value }))}
              className="w-full px-3 py-2 text-zinc-700  border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="recommended"
                checked={formData.recommended}
                onChange={(e) => setFormData(prev => ({ ...prev, recommended: e.target.checked }))}
                className="h-4 w-4 text-zinc-600 focus:ring-zinc-500 border-zinc-300 rounded"
              />
              <label htmlFor="recommended" className="ml-2 block text-sm text-zinc-700">
                Mark as recommended
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="h-4 w-4 text-zinc-600 focus:ring-zinc-500 border-zinc-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-zinc-700">
                Active
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-zinc-700">
                Features
              </label>
              <button
                type="button"
                onClick={addFeature}
                className="text-sm text-zinc-600 hover:text-zinc-900"
              >
                + Add Feature
              </button>
            </div>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="Feature description"
                    className="flex-1 px-3 py-2 text-zinc-700 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-zinc-700 bg-zinc-100 rounded-md hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}