import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';
import conf from '../config/config';

export default function RTE({ name, control, label, defaultValue = "" }) {
    return (
        <div className='w-full'>
            {label && <label className='inline-block mb-1 pl-1 text-muted-foreground font-medium'>{label}</label>} 
            <Controller
                name={name || "content"}
                control={control}
                render={({ field: { onChange } }) => (
                    <Editor
                        apiKey={conf.tinymceAPI}
                        initialValue={defaultValue}
                        init={{
                            initialValue: defaultValue,
                            height: 500,
                            menubar: true,
                            // Dark theme configuration for TinyMCE
                            skin: 'oxide-dark',
                            content_css: 'dark',
                            plugins: [
                                "image",
                                "advlist",
                                "autolink",
                                "lists",
                                "link",
                                "image",
                                "charmap",
                                "preview",
                                "anchor",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "insertdatetime",
                                "media",
                                "table",
                                "code",
                                "help",
                                "wordcount",
                                "anchor",
                            ],
                            toolbar:
                                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                            content_style: `
                                body { 
                                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                                    font-size: 16px;
                                    line-height: 1.7;
                                    color: #e0e0e0;
                                    background-color: #0a0a0a;
                                    padding: 20px;
                                }
                                p { margin-bottom: 1rem; }
                                h1, h2, h3, h4, h5, h6 { 
                                    color: #ffffff; 
                                    font-weight: 600; 
                                    margin-top: 2rem; 
                                    margin-bottom: 1rem;
                                    line-height: 1.3;
                                }
                                h1 { font-size: 2.25rem; }
                                h2 { font-size: 1.875rem; }
                                h3 { font-size: 1.5rem; }
                                h4 { font-size: 1.25rem; }
                                a { color: #ffffff; text-decoration: underline; }
                                a:hover { color: #d0d0d0; }
                                blockquote { 
                                    border-left: 4px solid #404040; 
                                    padding-left: 1.5rem; 
                                    margin: 2rem 0; 
                                    color: #b0b0b0; 
                                    font-style: italic; 
                                }
                                code { 
                                    background: #1a1a1a; 
                                    padding: 0.2rem 0.5rem; 
                                    border-radius: 0.375rem; 
                                    font-size: 0.9em; 
                                    color: #e0e0e0; 
                                }
                                pre { 
                                    background: #0f0f0f; 
                                    padding: 1.5rem; 
                                    border-radius: 0.75rem; 
                                    overflow-x: auto; 
                                    margin: 2rem 0; 
                                }
                                ul, ol { margin: 1.5rem 0; padding-left: 2rem; }
                                li { margin-bottom: 0.5rem; color: #d0d0d0; }
                                img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; }
                                table { border-collapse: collapse; width: 100%; margin: 2rem 0; }
                                th, td { border: 1px solid #404040; padding: 0.75rem; text-align: left; }
                                th { background-color: #1a1a1a; color: #ffffff; font-weight: 600; }
                                tr:nth-child(even) { background-color: #0f0f0f; }
                            `
                        }}
                        onEditorChange={onChange}
                    />
                )}
            />
        </div>
    )
}
