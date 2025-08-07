"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { useQuery } from "convex/react";
import { PlusIcon, SparklesIcon } from "lucide-react";
import React, { useState } from "react";
import { BarLoader } from "react-spinners";
import NewProjectModal from "./_components/NewProjectModal";
import ProjectGrid from "./_components/projectgrid";

const Dashboard = () => {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const { data: projects, isLoading } = useConvexQuery(
    api.project.getUserProjects
  );
  console.log("Data:", projects);
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Your Projects
            </h1>
            <p className="text-white/70">
              Create and manage your projects efficiently.
            </p>
          </div>
          <Button
            variant={"primary"}
            size={"lg"}
            className="gap-2"
            onClick={() => setShowNewProjectModal(true)}
          >
            <PlusIcon className="h-5 w-5" />
            New Project
          </Button>
        </div>
        {isLoading ? (
          <BarLoader width={"100%"} color="white" />
        ) : projects && projects.length > 0 ? (
          <ProjectGrid projects={projects} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Create Your First Project
            </h3>
            <p className="text-white/70 mb-8 max-w-md">
              Start by creating a new project to organize your tasks and
              collaborate with your team.
            </p>
            <Button
              variant={"primary"}
              size={"xl"}
              className="gap-2"
              onClick={() => setShowNewProjectModal(true)}
            >
              <SparklesIcon className="h-5 w-5" />
              Start Creating
            </Button>
          </div>
        )}
        <NewProjectModal
          isOpen={showNewProjectModal}
          onClose={() => setShowNewProjectModal(false)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
